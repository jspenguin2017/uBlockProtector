//Check modules and output some debug log
"use strict";

console.log("=====pretest.node.js starts=====");

//Timestamp
console.log(`${new Date().toString()} is the current time.`);

//Current working directory
console.log(`${process.cwd()} is the current working directory.`);

//Check modules version
const esprima = require("esprima");
console.log(`${esprima.version} is the version of Esprima.`);

console.log("=====pretest.node.js ends=====");
