//Check the functionality of Core
"use strict";

console.log("=====core.node.js starts=====");

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
 * Compare two arguments and fail or pass the test.
 * @function
 * @param {Any} result - The test result.
 * @param {Any} expected - The expected result.
 */
const compare = (result, expected) => {
    if (result === expected) {
        console.log(`Test for ${currentTest} passed.`);
    } else {
        console.log(`Test for ${currentTest} failed, test result and expected result will be printed to the screen.`);
        console.log(result, expected);
        //Fail the build
        process.exit(1);
    }
};
/**
 * Run a test.
 * @param {string} name - The name of the test.
 * @param {Function} test - The test function, should be synchronous and must call compare() inside.
 */
const test = (name, test) => {
    currentTest = name;
    test();
};

//Prepare environment
global.document = {
    domain: "localhost",
};
global.addEventListener = () => { };
const unsafeWindow = global;
//Load the core
let a = {};
eval(readFileSync("./Script Compiler/Libraries/yamd5.min.js", "utf8"));
eval(readFileSync("./Script Compiler/Core.js", "utf8"));

//a.applyMatch
test("a.applyMatch() match all", () => {
    compare(a.applyMatch(["this is a string", "this is another string"], a.matchMethod.matchAll), true);
});
test("a.applyMatch() match string", () => {
    compare(a.applyMatch(["this is a string", "this is another string"], a.matchMethod.string, "another"), true);
    compare(a.applyMatch(["this is a string", "this is another string"], a.matchMethod.string, "example"), false);
});
test("a.applyMatch() match exact string", () => {
    compare(a.applyMatch(["this is a string", "this is another string"], a.matchMethod.stringExact, "this is another string"), true);
    compare(a.applyMatch(["this is a string", "this is another string"], a.matchMethod.stringExact, "another string"), false);
});
test("a.applyMatch() match RegExp", () => {
    compare(a.applyMatch(["this is a string", "this is another string"], a.matchMethod.RegExp, /\s/), true);
    compare(a.applyMatch(["this is a string", "this is another string"], a.matchMethod.RegExp, /\d/), false);
});
//a.md5
test("a.md5()", () => {
    compare(a.md5("Hello world"), "3e25960a79dbc69b674cd4ec67a72c62");
    compare(a.md5("今天天气真好"), "5f4152cdb8693ed153cd36bd1686489e");
});


console.log("=====core.node.js ends=====");
