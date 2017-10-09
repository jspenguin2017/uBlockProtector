//Turn debug mode on or off
//The current working directory should be "/Extension Compiler"
"use strict";

/**
 * Load modules.
 * @const {Module}
 */
const { readFileSync, writeFileSync } = require("fs");
/**
 * The path of the file containing the debug switch.
 * @const {string}
 */
const path = "./Extension/common.js";
/**
 * State of the debug switch.
 * Pass "--enable" to enable debug mode, pass anything else to disable it.
 * @const {boolean}
 */
const state = process.argv[2] === "--enable";

//Update the debug switch
let data = readFileSync(path, "utf8");
data = data.replace(/a\.debugMode = (true|false);/, `a.debugMode = ${state};`);
writeFileSync(path, data);
console.log("Done.");
