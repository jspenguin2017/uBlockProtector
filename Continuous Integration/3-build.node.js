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
 * Print end message and exit.
 * @function
 * @param {integer} [code=0] - The exit coe.
 */
const exit = (code) => {
    console.log("=====3-build.node.js ends=====");
    process.exit(code || 0);
};

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
 * See if two versions are identital.
 * @function
 * @param {Version} v1 - The first version.
 * @param {Version} v2 - The second version.
 */
const verSame = (v1, v2) => v1.major === v2.major && v1.minor === v2.minor;
/**
 * See if two versions are consecutive.
 * @function
 * @param {Version} v1 - The first version.
 * @param {Version} v2 - The second version.
 */
const verNeedUpdate = (v1, v2) => {
    if (v1.major === v2.major) {
        return v1.minor + 1 === v2.minor;
    } else {
        return v1.major + 1 === v2.major && v2.minor === 0;
    }
};

/**
 * Obtain OAuth2 token, credentials are read from secure environment variables.
 * Will fail the build if the token could not be obtained.
 * @function
 * @return {Promise} The promise of the task.
 ** @param {string} token - The access token.
 */
const OAuth2 = () => {
    return new Promise((resolve) => {
        //Check environment variables
        if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.OAUTH_KEY) {
            throw new Error("Secure environment variables are missing.");
        }
        //Prepare payload
        const CLIENT_ID = encodeURIComponent(process.env.CLIENTID);
        const CLIENT_SECRET = encodeURIComponent(process.env.CLIENT_SECRET);
        const OAUTH_KEY = encodeURIComponent(process.env.OAUTH_KEY);
        const payload = `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${OAUTH_KEY}&grant_type=authorization_code&redirect_uri=urn:ietf:wg:oauth:2.0:oob`;
        //Send request
        https.request(Object.assign(url.parse("https://accounts.google.com/o/oauth2/token"), {
            method: "POST"
        }), (res) => {
            //
        }).write(payload).end();
    })
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
                    throw new Error("Could not extract published version from store page.");
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
    return new Promise((resolve) => {
        fs.readFile("./Extension Compiler/Extension/manifest.json", { encoding: "utf8" }, (err, data) => {
            if (err) {
                throw err;
            } else {
                resolve(new Version(JSON.parse(data).version));
            }
        });
    });
};

//Check if I have credentials
if (!process.env.CLIENT_SECRET) {
    console.log("No credentials, skipping build.");
    exit();
}
//Check version
Promise.all([
    getPublishedVersion(),
    getLocalVersion(),
]).then((versions) => {
    if (verSame(...versions)) {
        //Nothing to do
        console.log("Store version up to date, nothing to build.");
        exit();
    } else if (verNeedUpdate(...versions)) {
        OAuth2.then((token) => {
            //
        });
    } else {
        //Version is broken
        throw new Error("Unexpected versions, maybe last version is not yet approved.");
    }
});
