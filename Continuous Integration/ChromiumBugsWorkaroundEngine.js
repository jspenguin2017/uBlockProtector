//Temporary hacks to workaround Chromium bug, this file is synchronous
"use strict";

/**
 * Apply all workarounds for Chromium bugs.
 * Will fail the build if this task could not be completed.
 * @function
 * @return {Promise} The promise of the task.
 */
module.exports = () => {
    console.log("Applying workarounds for Chromium bugs...");
    return Promise.all([

        new Promise((resolve) => {
            //2017.08.06
            //Chromium bug workaround: https://github.com/jspenguin2017/uBlockProtector/issues/454
            //Make sure the generated file does not have a size that is multiple of 4096

            //Load modules
            const fs = require("fs");
            const path = require("path");

            //Find files to check
            let toCheck = [];
            const crawler = (dir) => {
                const files = fs.readdirSync(dir);
                for (let i = 0; i < files.length; i++) {
                    const newPath = path.join(dir, files[i]);
                    if (fs.statSync(newPath).isDirectory()) {
                        crawler(newPath);
                    } else {
                        toCheck.push(`./${newPath}`);
                    }
                }
            }
            crawler("./Extension Compiler/Extension");

            //Check size of each file
            let problematicFiles = [];
            for (let i = 0; i < toCheck.length; i++) {
                const remainder = fs.statSync(toCheck[i]).size % 4096;
                if (isNaN(remainder)) {
                    console.error(`Could not read size of ${toCheck[i]}: Could not access file.`);
                    process.exit(1);
                } else if (remainder === 0) {
                    if (toCheck[i].endsWith(".png")) {
                        console.error(`Image file ${toCheck[i]} has a size that is a multiple of 4096, aborting build...`);
                        process.exit(1);
                    } else {
                        problematicFiles.push(toCheck[i]);
                        console.log(`${toCheck[i]} needs to be padded.`);
                    }
                }
            }

            //Pad files
            for (let i = 0; i < problematicFiles.length; i++) {
                fs.appendFileSync(problematicFiles[i], "  ");
            }

            //End
            resolve();
        }),

    ]);
};
