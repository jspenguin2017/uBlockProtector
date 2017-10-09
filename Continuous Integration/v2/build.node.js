//Build extension in production mode
"use strict";


/**
 * Load modules.
 * @const {Module}
 */
const util = require("util");
const fs = (() => {
    const ofs = require("fs");
    return {
        readFile: util.promisify(ofs.readFile),
    };
})();
const path = require("path");
const esprima = require("esprima");

/**
 * Build one file.
 * @function
 * @param {string} file - The path to the file to build.
 */
const buildFile = async (file) => {
    let data = await fs.readFile(file, "utf8").split("\n");

};


//Show status
console.log(`Time:                      ${new Date().toString()}`);
console.log(`Current working directory: ${process.cwd()}`);
console.log(`Esprima version:           ${esprima.version}`);

//Find files to build
