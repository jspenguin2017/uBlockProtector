//Check syntax
"use strict";

console.log("Syntax test started.");

//Load Esprima
const esprima = require("esprima");
const { readFileSync } = require("fs");

//Load the compiled script
const dist = readFileSync("uBlockProtector.user.js").toString();
//Print a sample of the file to make sure the file is properly loaded
console.log("Compiled script loaded, here is a small sample of the file:");
console.log(dist.substring(1000, 2000));
//Verify the compiled script
esprima.parse(dist);
