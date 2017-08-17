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

    return new Promise((finalResolve) => {
        //2017.08.06 https://github.com/jspenguin2017/uBlockProtector/issues/454
        //Chromium <=58: Unknown
        //Chromium 59, 60: Confirmed bugged
        //Chromium >=61: Confirmed fixed
        //Make sure files do not have a size that is multiple of 4096, and pad them if needed

        //Load modules
        const fs = require("fs");
        const path = require("path");

        (new Promise((resolve) => {
            //Find files to check
            let filesToCheck = [];
            let runningCrawlers = 0;
            let runningStats = 0;
            const checkEnd = () => {
                if (runningCrawlers === 0 && runningStats === 0) {
                    resolve(filesToCheck);
                }
            };
            const crawler = (dir) => {
                runningCrawlers++;
                fs.readdir(dir, (err, files) => {
                    if (err) {
                        console.error(`Could not collect files to check: Directory ${dir} could not be accessed.`);
                        process.exit(1);
                    } else {
                        for (let i = 0; i < files.length; i++) {
                            runningStats++;
                            const newPath = path.join(dir, files[i]); //Constant bind to current iteration
                            fs.stat(newPath, (err, stats) => {
                                if (err) {
                                    console.error(`Could not collect files to check: File ${newPath} could not be accessed.`);
                                    process.exit(1);
                                } else {
                                    if (stats.isDirectory()) {
                                        crawler(newPath);
                                    } else {
                                        filesToCheck.push(`./${newPath}`);
                                    }
                                }
                                runningStats--;
                                checkEnd();
                            });
                        }
                        runningCrawlers--;
                        checkEnd();
                    }
                });
            }
            crawler("./Extension Compiler/Extension");
        })).then((filesToCheck) => {
            return new Promise((resolve) => {
                //Check size of each file
                if (filesToCheck.length === 0) {
                    console.warn("No file to check, are you scanning the right directory?");
                    process.nextTick(resolve, []);
                } else {
                    let problematicFiles = [];
                    let runningStats = 0;
                    for (let i = 0; i < filesToCheck.length; i++) {
                        runningStats++;
                        const file = filesToCheck[i]; //Constant bind to current iteration
                        fs.stat(file, (err, stats) => {
                            if (err) {
                                console.error(`Could not collect files to pad: File ${file} could not be accessed.`);
                                process.exit(1);
                            } else {
                                if (stats.size % 4096 === 0) {
                                    if (file.endsWith(".png")) {
                                        console.error(`Image file ${file} has a size that is a multiple of 4096, aborting build...`);
                                        process.exit(1);
                                    } else {
                                        problematicFiles.push(file);
                                        console.log(`${file} needs to be padded.`);
                                    }
                                }
                            }
                            if ((--runningStats) === 0) {
                                resolve(problematicFiles);
                            }
                        });
                    }
                }
            });
        }).then((problematicFiles) => {
            //Pad files
            if (problematicFiles.length === 0) {
                process.nextTick(finalResolve);
            } else {
                let runningAppend = 0;
                for (let i = 0; i < problematicFiles.length; i++) {
                    runningAppend++;
                    const file = problematicFiles[i]; //Constant bind to current iteration
                    fs.appendFile(file, "  ", (err) => {
                        if (err) {
                            console.error(`Could not add padding: File ${file} is not writtable.`);
                            process.exit(1);
                        }
                        if ((--runningAppend) === 0) {
                            finalResolve();
                        }
                    });
                }
            }
        }).catch(() => {
            process.emit("uncaughtException");
        });
    });
};
