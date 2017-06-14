//Check syntax
"use strict";

console.log("=====syntax.node.js starts=====");

//Load Esprima
const esprima = require("esprima");
const { readFileSync } = require("fs");

//Verify the compiled script
console.log("Compiled Script is being verified...");
const dist = readFileSync("uBlockProtector.user.js", "utf8");
esprima.parse(dist);
console.log("Compiled Script is syntactically valid.");

console.log("=====syntax.node.js ends=====");
