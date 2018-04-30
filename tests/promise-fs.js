/**
 * Promisified file system module.
 *
 * Watches for "--trace-fs" command line argument, if exists
 * file system calls are logged.
 */
"use strict";


/**
 * Load modules.
 * @const {Module}
 */
const fs = require("fs");
const util = require("util");

/**
 * The new file system namespace, functions are added as needed.
 * @const {Namespace}
 */
const newfs = {
    appendFile: util.promisify(fs.appendFile),
    copyFile: util.promisify(fs.copyFile),
    createReadStream: fs.createReadStream,
    createWriteStream: fs.createWriteStream,
    lstat: util.promisify(fs.lstat),
    mkdir: util.promisify(fs.mkdir),
    readdir: util.promisify(fs.readdir),
    readFile: util.promisify(fs.readFile),
    writeFile: util.promisify(fs.writeFile),
};

/**
 * Print variables, truncate long strings.
 * @function
 * @param {Any} ...args - Variables to print.
 */
const varDump = (...args) => {
    let out = [];
    for (const arg of args) {
        if (typeof arg === "string" && arg.length > 200) {
            out.push("<String " + arg.substring(0, 200) + " ... >");
        } else {
            out.push(arg);
        }
    }
    console.log(...out);
};
/**
 * Make a file system access tracer.
 * @function
 * @param {string} name - The function to intercept.
 * @return {Function} The tracer.
 */
const makeTracer = (name) => {
    return (...args) => {
        varDump("fs." + name, ...args);
        return newfs[name](...args);
    };
};


if (process.argv.includes("--trace-fs")) {
    module.exports = {};
    for (const key in newfs) {
        if (newfs.hasOwnProperty(key)) {
            module.exports[key] = makeTracer(key);
        }
    }
} else {
    module.exports = newfs;
}
