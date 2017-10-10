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
            const newPath = path.join(dir, files[i]);

            if ((await fs.stat(newPath)).isDirectory()) {
                await _crawler(newPath);
            } else if (newPath.endsWith(".js")) {
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
    const pathFrags = file.split(/\/|\\/);
    let data = await fs.readFile(file, "utf8");

    data = data.split("\n");
    for (let i = 0; i < data.length; i++) {
        if (data[i].trim() === "//@pragma-if-debug") {
            do {
                data.splice(i, 1);
            } while (data[i].trim() !== "//@pragma-end-if");
            data.splice(i, 1);
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

    console.log(`Built ${file}`);
};


//Show status
console.log(`Current working directory: ${process.cwd()}`);
console.log(`Current time:              ${new Date().toString()}`);
console.log(`Esprima version:           ${esprima.version}`);
console.log();

//Find files to build
crawler("./Extension Compiler/Extension").then(files => {
    console.log(`${files.length} files to build`);
    files.forEach(build);
});

//Workaround a bug in Chrome 60
(async () => {
    const crawler = async (dir) => {
        let filesToCheck = [];

        const _crawler = async (dir) => {
            const files = await fs.readdir(dir);

            for (let i = 0; i < files.length; i++) {
                const newPath = path.join(dir, files[i]);

                if ((await fs.stat(newPath)).isDirectory()) {
                    await _crawler(newPath);
                } else {
                    filesToCheck.push(`./${newPath}`);
                }
            }
        }

        await _crawler(dir);
        return filesToCheck;
    };

    (await crawler("./Extension Compiler/Extension")).filter(file => {
        if (file.endsWith(".png")) {
            throw new Error("An image file has size that is a multiple of 4096!");
        }
        
    });
})();
