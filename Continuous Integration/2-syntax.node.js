//Check syntax
"use strict";

console.log("=====2-syntax.node.js starts=====");

/**
 * Load modules.
 * @const {Module}
 */
const esprima = require("esprima");
const { readFileSync, readdirSync, statSync } = require("fs");
const path = require("path");

/**
 * Verify the syntax of a file.
 * @param {string} file - The file to verify.
 * @param {string} description - The description of the file.
 */
const testRunner = (file) => {
    esprima.parse(readFileSync(file, "utf8"));
    console.log(`${file} is syntactically valid.`);
};

//Check modules version
console.log(`${esprima.version} is the version of Esprima.`);
//Find scripts to verify
let scripts = [];
const crawler = (dir) => {
    const files = readdirSync(dir);
    for (let i = 0; i < files.length; i++) {
        const newPath = path.join(dir, files[i]);
        if (statSync(newPath).isDirectory()) {
            crawler(newPath);
        } else if (newPath.endsWith(".js")) {
            scripts.push(`./${newPath}`);
        }
    }
}
crawler("./Extension Compiler");
//Verify each script
for (let i = 0; i < scripts.length; i++) {
    testRunner(scripts[i]);
}

console.log("=====2-syntax.node.js ends=====");
