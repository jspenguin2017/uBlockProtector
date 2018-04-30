/**
 * Check for syntax error.
 */
"use strict";

/**
 * Load modules.
 * @const {Module}
 */
const assert = require("assert");
const esprima = require("esprima");
const fs = require("./promise-fs.js");

/**
 * Validate syntax of a JavaScript file.
 * @async @function
 * @param {string} file - The path to the file to check.
 */
const validateJS = async (file) => {
    const data = await fs.readFile(file, "utf8");
    esprima.parse(data);
};
/**
 * Validate syntax of a JSON file.
 * @async @function
 * @param {string} file - The path to the file to check.
 */
const validateJSON = async (file) => {
    const data = await fs.readFile(file, "utf8");
    JSON.parse(data);
};

/**
 * Check syntax recursively for one directory.
 * @async @function
 * @param {string} directory - The path to the directory to check.
 */
exports.validateDirectory = async (directory) => {
    const files = await fs.readdir(directory);

    let tasks = [];
    for (const file of files) {
        tasks.push(fs.lstat(directory + "/" + file));
    }
    tasks = await Promise.all(tasks);
    assert(files.length === tasks.length);

    let validateTasks = [];
    for (let i = 0; i < files.length; i++) {
        assert(!tasks[i].isSymbolicLink());

        if (tasks[i].isDirectory()) {
            // One directory at a time to make sure things will not get
            // overloaded
            await exports.validateDirectory(directory + "/" + files[i]);
            continue;
        }

        assert(tasks[i].isFile());
        if (files[i].endsWith(".js")) {
            validateTasks.push(validateJS(directory + "/" + files[i]));
        } else if (files[i].endsWith(".json")) {
            validateTasks.push(validateJSON(directory + "/" + files[i]));
        }
    }
    await Promise.all(validateTasks);
};
