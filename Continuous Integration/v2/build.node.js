//Build extension in production mode
"use strict";


process.on("unhandledRejection", (err) => {
    throw err;
});


/**
 * The build output path. Only JavaScript files will be built.
 * Must be set to overwrite source files if running on Continuous Integration
 * servers.
 */
//const buildTarget = "./Extension Compiler/Extension";
const buildTarget = "./Extension Compiler/Build";

/**
 * Load modules.
 * @const {Module}
 */
const util = require("util");
const fs = (() => {
    const ofs = require("fs");
    return {
        readdir: util.promisify(ofs.readdir),
        stat: util.promisify(ofs.stat),

        readFile: util.promisify(ofs.readFile),
        mkdir: util.promisify(ofs.mkdir),
        writeFile: util.promisify(ofs.writeFile),

        appendFile: util.promisify(ofs.appendFile),
    };
})();
const path = require("path");
const esprima = require("esprima");

/**
 * Craw recursively and find all JavaScript files
 * @param {any} dir
 */
const crawler = async (dir) => {
    let scripts = [];

    const _crawler = async (dir) => {
        const files = await fs.readdir(dir);

        for (let i = 0; i < files.length; i++) {
            let newPath = path.join(dir, files[i]);

            if ((await fs.stat(newPath)).isDirectory()) {
                await _crawler(newPath);
            } else if (newPath.endsWith(".js")) {
                newPath = newPath.replace(/\\/g, "/");
                scripts.push(`./${newPath}`);
            }
        }
    }

    await _crawler(dir);
    return scripts;
};

/**
 * Build one file.
 * @function
 * @param {string} file - The path to the file to build.
 */
const build = async (file) => {
    console.log(`Building ${file}`);

    const pathFrags = file.split("/");
    let data = await fs.readFile(file, "utf8");

    data = data.split("\n");
    for (let i = 0; i < data.length; i++) {
        if (data[i].trim() === "//@pragma-if-debug") {
            do {
                if (data.splice(i, 1).length < 1) {
                    throw new Error("@pragma-if-debug directive does not have a matching @pragma-end-if");
                }
            } while (data[i].trim() !== "//@pragma-end-if");
            data.splice(i, 1);
        }

        //Cannot cache the trimmed line since the line may change
        if (data[i].trim() === "//@pragma-end-if") {
            throw new Error("@pragma-end-if directive does not have a matching @pragma-if-*");
        }

        const line = data[i].trim();
        if (line.startsWith("//@pragma-")) {
            console.warn(`Unrecognized directive ${line}`);
        }
    }
    data = data.join("\n");

    esprima.parse(data);

    let buildPath = pathFrags.slice(3);
    let currentPath = buildTarget;
    for (let i = 0; i < buildPath.length; i++) {
        //Last path element is not a directory, this is working as intended
        try {
            await fs.mkdir(currentPath);
        } catch (err) {
            if (err.code !== "EEXIST") {
                throw err;
            }
        }
        currentPath += `/${buildPath[i]}`;
    }
    await fs.writeFile(currentPath, data, { encoding: "utf8" });

    console.log(`Built to ${currentPath}`);
};


(async () => {
    console.log(`Current working directory: ${process.cwd()}`);
    console.log(`Current time:              ${new Date().toString()}`);
    console.log(`Esprima version:           ${esprima.version}`);
    console.log();

    const files = await crawler("./Extension Compiler/Extension");
    console.log(`${files.length} files to build`);
    for (let i = 0; i < files.length; i++) {
        await build(files[i]);
    }
    console.log("Done");
    console.log();

    //Workaround a bug in Chrome 60
    {
        console.log("Trying to workaround https://bugs.chromium.org/p/chromium/issues/detail?id=754282");

        const crawler = async (dir) => {
            let filesToCheck = [];

            const _crawler = async (dir) => {
                const files = await fs.readdir(dir);

                for (let i = 0; i < files.length; i++) {
                    let newPath = path.join(dir, files[i]);

                    if ((await fs.stat(newPath)).isDirectory()) {
                        await _crawler(newPath);
                    } else {
                        newPath = newPath.replace(/\\/g, "/");
                        filesToCheck.push(`./${newPath}`);
                    }
                }
            }

            await _crawler(dir);
            return filesToCheck;
        };

        const files = await crawler(buildTarget);
        for (let i = 0; i < files.length; i++) {
            const size = (await fs.stat(files[i])).size;

            if (size % 4096 === 0) {
                if (files[i].endsWith(".png")) {
                    throw new Error("An image file has a size that is a multiple of 4096!");
                }

                await fs.appendFile(files[i], "  ", { encoding: "utf8" });
            }
        }

        console.log("Done");
    }
})();
