//Check the functionality of content Core
"use strict";

console.log("=====2-test-2-content-core.node.js starts=====");

/**
 * Load module.
 * @const {Module}
 */
const { readFileSync } = require("fs");

/**
 * The name of the current test.
 * @var {string}
 */
let currentTest;
/**
 * Compare two arguments then fail or pass the test.
 * @function
 * @param {Any} result - The test result.
 * @param {Any} expected - The expected result.
 */
const compare = (result, expected) => {
    if (result === expected) {
        console.log(`- Test for ${currentTest} passed.`);
    } else {
        console.log(`- Test for ${currentTest} failed, test result and expected result will be printed to the screen.`);
        console.log(result, expected);
        //Fail the build
        process.exit(1);
    }
};
/**
 * Run a test.
 * @param {string} name - The name of the test.
 * @param {Function} test - The test function, must be synchronous and must call compare() inside.
 */
const test = (name, test) => {
    currentTest = name;
    test();
};

//Prepare environment
global.document = {};
global.document.domain = "localhost";
let a = {};
a.debugMode = false;
//Load the core
eval(readFileSync("./Extension Compiler/Extension/content/content-core.js", "utf8"));

//a.cookie
//USE global.document.cookie
test("a.cookie() get mode", () => {
    global.document.cookie = "test=test; another test=test2; last test=hi";
    compare(a.cookie("test"), "test");
    compare(a.cookie("another test"), "test2");
    compare(a.cookie("last test"), "hi");
    compare(a.cookie("not found"), null);
});

console.log("=====2-test-2-content-core.node.js ends=====");
