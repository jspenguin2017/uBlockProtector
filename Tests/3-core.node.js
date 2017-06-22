//Check the functionality of Core
"use strict";

//Test not ready
process.exit(0);
////////////////

console.log("=====3-core.node.js starts=====");

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
global.addEventListener = () => { };
global.document = {
    domain: "localhost", //Placeholder
};
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
    compare(a.applyMatch(["this is a string", "this is another string"], a.matchMethod.string, "not found"), false);
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
test("a.md5() ASCII string", () => {
    compare(a.md5("Hello world"), "3e25960a79dbc69b674cd4ec67a72c62");
});
test("a.md5() UTF-8 string", () => {
    compare(a.md5("今天天气真好"), "5f4152cdb8693ed153cd36bd1686489e");
});
//a.cookie
//USE global.document.cookie
test("a.cookie() get mode", () => {
    global.document.cookie = "test=test; another test=test2; last test=hi";
    compare(a.cookie("test"), "test");
    compare(a.cookie("another test"), "test2");
    compare(a.cookie("last test"), "hi");
    compare(a.cookie("not found"), null);
});
//a.readOnly
//USE global.singleLayerReadOnly
//USE global.multipleLayersReadOnly
test("a.readOnly() single layer", () => {
    a.readOnly("singleLayerReadOnly", "hi");
    global.singleLayerReadOnly = 5;
    compare(global.singleLayerReadOnly, "hi");
});
test("a.readOnly() multiple layers", () => {
    global.multipleLayersReadOnly = {
        test1: {
            test2: {}
        }
    };
    a.readOnly("multipleLayersReadOnly.test1.test2.test3", "hi");
    global.multipleLayersReadOnly.test1.test2.test3 = 5;
    compare(global.multipleLayersReadOnly.test1.test2.test3, "hi");
});
//a.noAccess
//USE global.singleLayerNoAccess
//USE global.multipleLayersNoAccess
test("a.noAccess() single layer", () => {
    a.noAccess("singleLayerNoAccess");
    try {
        global.singleLayerNoAccess = 5;
        compare(true, false);
    } catch (err) {
        compare(true, true);
    }
});
test("a.noAccess() multiple layers", () => {
    global.multipleLayersNoAccess = {
        test1: {
            test2: {}
        }
    };
    a.noAccess("multipleLayersNoAccess.test1.test2.test3");
    try {
        global.multipleLayersNoAccess.test1.test2.anotherTest = 5;
        compare(true, true);
    } catch (err) {
        compare(true, false);
    }
    try {
        global.multipleLayersNoAccess.test1.test2.test3
        compare(true, false);
    } catch (err) {
        compare(true, true);
    }
});
//a.filter
//USE global.singleLayerFilter
//USE global.multipleLayersFilter
test("a.filter() single layer", () => {
    global.singleLayerFilter = (arg) => arg;
    a.filter("singleLayerFilter", a.matchMethod.stringExact, "hi");
    compare(global.singleLayerFilter("hi"), undefined);
    compare(global.singleLayerFilter("hello"), "hello");
});
test("a.filter() multiple layers", () => {
    global.multipleLayersFilter = {
        test1: {
            test2(arg) {
                return arg;
            }
        }
    };
    a.filter("multipleLayersFilter.test1.test2", a.matchMethod.stringExact, "hi");
    compare(global.multipleLayersFilter.test1.test2("hi"), undefined);
    compare(global.multipleLayersFilter.test1.test2("hello"), "hello");
});

console.log("=====3-core.node.js ends=====");
