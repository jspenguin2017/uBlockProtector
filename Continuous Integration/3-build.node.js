//Build and publish the new version
"use strict";

console.log("=====3-build.node.js starts=====");

/**
 * Load modules.
 * @const {Module}
 */
const https = require("https");
const url = require("url");
const fs = require("fs");

/**
 * Version object.
 * @class
 */
const Version = class {
    /**
     * Constructor.
     * @constructor
     * @param {string} v - The version string, must be like "1.4".
     */
    constructor(v) {
        const i = v.indexOf(".");
        this.major = parseInt(v.substring(0, i));
        this.minor = parseInt(v.substring(i + 1));
    }
};
/**
 * See if two versions are consecutive.
 * @function
 * @param {Version} v1 - The first version.
 * @param {Version} v2 - The second version.
 */
const verCmp = (v1, v2) => {
    if (v1.major === v2.major) {
        return v1.minor + 1 === v2.minor;
    } else {
        return v1.major + 1 === v2.major && v2.minor === 0;
    }
};
/**
 * Find current version that is published in the store, will fail the build if the version could not be found.
 * The "proper" API for this seems to only work for unpublished draft: https://developer.chrome.com/webstore/webstore_api/items/get
 * @function
 * @return {Promise} The promise of the task.
 ** @param {Version} v1 - The version.
 */
const getPublishedVersion = () => {
    return new Promise((resolve) => {
        https.request(url.parse("https://chrome.google.com/webstore/detail/ublock-protector-extensio/ggolfgbegefeeoocgjbmkembbncoadlb"), (res) => {
            let data = "";
            res.on("data", (c) => { data += c; });
            res.on("end", () => {
                const match = (/<meta itemprop="version" content="(\d+\.\d+)" \/>/).exec(data);
                if (match) {
                    resolve(new Version(match[1]));
                } else {
                    throw new Error("Could not extract published version.");
                }
            });
        }).on("error", (err) => {
            throw err;
        }).end();
    });
};
/**
 * Find local version that is ready to be published to the store, will fail the build if the version could not be found.
 * Expects the current working directory to be the Git Root.
 * @function
 * @return {Promise} The promise of the task.
 ** @param {Version} v2 - The version.
 */
const getLocalVersion = () => {
    return new Promise(() => {
        fs.readFile("./Extension Compiler/Extension/manifest.json", { encoding: "utf8" }, (err, data) => {
            if (err) {
                throw err;
            } else {
                resolve(new Version(JSON.parse(data).version));
            }
        });
    });
};

Promise.all([
    getPublishedVersion(),
    getLocalVersion(),
]).then((versions) => {
    console.log(versions);
    console.log(verCmp(...versions));
});

console.log("=====3-build.node.js ends=====");
