//Check syntax
"use strict";

console.log("Syntax test started.");

//Load Esprima
const esprima = require("esprima");
const { readFileSync } = require("fs");

//Verify the compiled script
const dist = readFileSync("uBlockProtector.user.js");
esprima.parse(dist);
