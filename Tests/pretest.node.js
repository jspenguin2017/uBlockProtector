//Check modules and output some debug log
"use strict";

//Timestamp
console.log(`${new Date().toString()} is the current tim.`);

//Current working directory
console.log(`${process.cwd()} is the current working directory.`);

//Check modules version
const esprima = require("esprima");
console.log(`${esprima.version} is the version of Esprima.`);

console.log("Tests are starting...");
