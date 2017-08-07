//Temporary hacks to workaround Chromium bug
"use strict";

/**
 * Apply all workarounds for Chromium bugs.
 * Will fail the build if this task could not be completed.
 * @function
 * @return {Promise} The promise of the task.
 */
module.exports = () => {
    console.log("Applying workarounds for Chromium bugs...");

    return new Promise((resolve) => {
        //2017.08.06 https://github.com/jspenguin2017/uBlockProtector/issues/454
        //Make sure files do not have a size that is multiple of 4096, and pad them if needed
        //This is mostly synchronous since it is kind of hard to make it asynchronous, and nothing else should run until this finishes anyway

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
        let doneCount = 0;
        const onDone = (err) => {
            if (err) {
                console.error(`Could not add padding: Could not write to file.`);
                process.exit(1);
            } else if ((++doneCount) === problematicFiles.length) {
                resolve();
            }
        };
        for (let i = 0; i < problematicFiles.length; i++) {
            fs.appendFile(problematicFiles[i], "  ", onDone);
        }

        //End here if nothing to pad
        if (problematicFiles.length === 0) {
            process.nextTick(resolve);
        }
    });
};
