//Check syntax
"use strict";

console.log("=====syntax.node.js starts=====");

/**
 * Load modules.
 * @const {Module}
 */
const esprima = require("esprima");
const { readFileSync } = require("fs");

//Check modules version
console.log(`${esprima.version} is the version of Esprima.`);

//Verify the compiled script
console.log("Compiled script is being verified...");
const dist = readFileSync("uBlockProtector.user.js", "utf8");
esprima.parse(dist);
console.log("Compiled script is syntactically valid.");

console.log("=====syntax.node.js ends=====");
