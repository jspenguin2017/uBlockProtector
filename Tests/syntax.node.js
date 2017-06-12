//Check syntax
"use strict";

console.log("=====syntax.node.js starts=====");

//Load Esprima
const esprima = require("esprima");
const { readFileSync } = require("fs");

//Verify the compiled script
console.log("Compiled script is being verified...");
const dist = readFileSync("uBlockProtector.user.js").toString();
esprima.parse(dist);
console.log("Compiled script is syntactically valid.");

console.log("=====syntax.node.js ends=====");
