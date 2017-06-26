//Build and publish a new version, this script will swallow all errors and only display hard coded generic
//messages for security, some errors will be reported to a secure channel
//Requires these secure environment variables:
//  CLIENT_ID, CLIENT_SECRET: Client ID and secret
//  REFRESH_TOKEN: Refresh token
//  VERSION_KEY: Key used to save last build version
//Requires the current working directory to be the Git Root
//Exit code: 0 for success, 1 for caught error, 2 for uncaught error
//If commit message starts with "@build-script-do-not-run", then build script will do nothing and immediately
//exit
//If commit message starts with "@build-script-force-run", then version check is skipped
"use strict";

//Register unexpected error handler, swallow all uncaught errors as they may contain credentials
//It is not safe to attempt to report this error as I do not know what went wrong
process.on("uncaughtException", () => {
    console.error("Unknown error: This could be caused by a bug in the build script.");
    process.exit(2);
});

//Start
console.log("=====3-build.node.js starts=====");

/**
 * Load modules.
 * @const {Module}
 */
const https = require("https");
const url = require("url");
const fs = require("fs");
let archiver;
try {
    archiver = require("archiver");
} catch (err) {
    console.error("Could not load archiver module: Module is not installed.");
    process.exit(1);
}

/**
 * The provider of extended API.
 * @const {string}
 */
const extendedAPIProvider = "https://jspenguin.com/API/uBlockProtector";
/**
 * The provider of secure error reporting channel.
 * @const {string}
 */
const secureErrorReportProvider = "https://jspenguin.com/PrivateMessage/API.php";
/**
 * The prefix of error report reference.
 * @const {string}
 */
const secureErrorReportPrefix = "uBlock Protector Automated Deploy ";

/**
 * Print end message and exit with exit code 0.
 * @function
 */
const exit = () => {
    console.log("=====3-build.node.js ends=====");
    process.exit(0);
};

/**
 * Version object, represents a version.
 * @class
 */
const Version = class {
    /**
     * Constructor.
     * @constructor
     * @param {string} v - The version string, format must be like "1.4".
     */
    constructor(v) {
        const i = v.indexOf(".");
        this.stringVal = v;
        this.major = parseInt(v.substring(0, i));
        this.minor = parseInt(v.substring(i + 1));
    }
    /**
     * Get the original string representation of the version.
     * @method
     * @return {string} The version string.
     */
    toString() {
        return this.stringVal;
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
        //Change in major version is hard to handle, as it happens once a blue moon this should be good enough
        return v1.major + 1 === v2.major && v2.minor === 0;
    }
};

/**
 * Serialize an object to parameters, throws error if the object is invalid.
 * @param {Object} obj - The object to serialize.
 * @return {string} The serialized string.
 */
const serialize = (obj) => {
    let str = "";
    for (let key in obj) {
        if (str !== "") {
            str += "&";
        }
        if (typeof obj[key] === "string") {
            str += `${key}=${encodeURIComponent(obj[key])}`;
        } else {
            throw "Invalid parameter";
        }
    }
    return str;
};

/**
 * Report error to a secure channel, then fail the build.
 * @function
 * @param {string} ref - The error reference.
 * @param {string} err - The error message.
 */
const secureErrorReport = (ref, err) => {
    console.log("Reporting this error to a secure channel...");
    let payload;
    try {
        payload = serialize({
            cmd: "send",
            reference: ref,
            message: err,
        });
    } catch (err) {
        console.error("Could not report error: Error reference or message is not valid.");
        process.exit(1);
    }
    let request = https.request(Object.assign(url.parse(secureErrorReportProvider), {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": payload.length,
        },
    }), (res) => {
        let data = "";
        res.setEncoding("utf8");
        res.on("data", (c) => { data += c; });
        res.on("error", () => {
            console.error("Could not report error: Could not connect to remote server.");
            process.exit(1);
        });
        res.on("end", () => {
            if (data === "ok") {
                console.log("Error reported.");
            } else {
                console.error("Could not report error: Remote server returned an error.");
            }
            process.exit(1);
        });
    });
    request.on("error", () => {
        console.error("Could not report error: Could not connect to remote server.");
        process.exit(1);
    });
    request.write(payload);
    request.end();
};

/**
 * Disable debug mode.
 * Will fail the build if this task could not be completed.
 * @function
 * @return {Promise} The promise of the task.
 */
const disableDebugMode = () => {
    console.log("Setting debug switch to false...");
    return new Promise((resolve) => {
        const file = "./Extension Compiler/Extension/common.js";
        fs.readFile(file, { encoding: "utf8" }, (err, data) => {
            if (err) {
                console.error("Could not set debug switch: Could not read file.");
                process.exit(1);
            } else {
                fs.writeFile(file, data.replace(
                    "a.debugMode = true; //@pragma-debug-switch",
                    "a.debugMode = false; //@pragma-debug-switch"
                ), (err) => {
                    if (err) {
                        console.error("Could not set debug switch: Could not write to file.");
                        process.exit(1);
                    } else {
                        resolve();
                    }
                });
            }
        });
    });
};
/**
 * Create zip archive ready for upload.
 * Will fail the build if this task could not be completed.
 * @function
 * @return {Promise} The promise of the task.
 ** @param {Buffer} data - The zip data.
 */
const zip = () => {
    console.log("Creating zip archive...");
    return new Promise((resolve) => {
        let data = [];
        let archive = archiver.create("zip", {});
        archive.on("warning", () => {
            console.error("Could not create archive: Something went wrong.");
            process.exit(1);
        });
        archive.on("error", () => {
            console.error("Could not create archive: Something went wrong.");
            process.exit(1);
        });
        archive.on("data", (c) => { data.push(c); });
        archive.on("end", () => {
            resolve(Buffer.concat(data));
        });
        archive.directory("./Extension Compiler/Extension", false);
        archive.finalize();
    });
};

/**
 * Obtain OAuth2 access token, credentials are read from secure environment variables.
 * Will fail the build if this task could not be completed.
 * Obtain client ID and secret: https://developers.google.com/identity/protocols/OAuth2
 * Obtain OAuth2 code and redeem refresh token: https://developer.chrome.com/webstore/using_webstore_api
 * @function
 * @return {Promise} The promise of the task.
 ** @param {string} token - The access token.
 */
const OAuth2 = () => {
    console.log("Obtaining access token...");
    return new Promise((resolve) => {
        //Prepare payload
        let payload;
        try {
            payload = serialize({
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                refresh_token: process.env.REFRESH_TOKEN,
                grant_type: "refresh_token",
            });
        } catch (err) {
            console.error("Could not obtain access token: Secure environment variables are invalid.");
            process.exit(1);
        }
        //Send request
        let request = https.request(Object.assign(url.parse("https://accounts.google.com/o/oauth2/token"), {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": payload.length,
            },
        }), (res) => {
            let data = "";
            res.setEncoding("utf8");
            res.on("data", (c) => { data += c; });
            res.on("error", () => {
                console.error("Could not obtain access token: Could not connect to remote server.");
                process.exit(1);
            });
            res.on("end", () => {
                try {
                    const response = JSON.parse(data);
                    if (response.error || typeof response.access_token !== "string") {
                        console.error("Could not obtain access token: Remote server returned an error.");
                        secureErrorReport(`${secureErrorReportPrefix}OAuth2 Error`, data);
                    } else {
                        resolve(response.access_token);
                    }
                } catch (err) {
                    console.error("Could not obtain access token: Could not parse response.");
                    process.exit(1);
                }
            });
        });
        request.on("error", () => {
            console.error("Could not obtain access token: Could not connect to remote server.");
            process.exit(1);
        });
        request.write(payload);
        request.end();
    });
};
/**
 * Upload a new build to the store.
 * Will fail the build if this task could not be completed.
 * @function
 * @param {string} token - The access token.
 * @param {Buffer} data - The new build package.
 * @return {Promise} The promise of the task.
 */
const upload = (token, data) => {
    console.log("Uploading new build...");
    return new Promise((resolve) => {
        let request = https.request(Object.assign(url.parse("https://www.googleapis.com/upload/chromewebstore/v1.1/items/ggolfgbegefeeoocgjbmkembbncoadlb"), {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "x-goog-api-version": "2",
            },
        }), (res) => {
            let data = "";
            res.setEncoding("utf8");
            res.on("data", (c) => { data += c; });
            res.on("error", () => {
                console.error("Could not upload new build: Could not connect to remote server.");
                process.exit(1);
            });
            res.on("end", () => {
                try {
                    const response = JSON.parse(data);
                    if (response.uploadState === "SUCCESS") {
                        resolve();
                    } else if (response.uploadState === "IN_PROGRESS") {
                        console.log("Remote server is processing the uploaded package, continuing in 1 minute...");
                        setTimeout(resolve, 60 * 1000); //Wait a minute
                    } else {
                        console.error("Could not upload new build: Remote server returned an error.");
                        secureErrorReport(`${secureErrorReportPrefix}Upload Failed`, data);
                    }
                } catch (err) {
                    console.error("Could not upload new build: Could not parse response.");
                    process.exit(1);
                }
            });
        });
        request.on("error", () => {
            console.error("Could not upload new build: Could not connect to remote server.");
            process.exit(1);
        });
        request.write(data);
        request.end();
    });
};
/**
 * Publish the new build.
 * Will fail the build if this task could not be completed.
 * @function
 * @param {string} token - The access token.
 * @return {Promise} The promise of the task.
 */
const publish = (token) => {
    console.log("Publishing new build...");
    return new Promise((resolve) => {
        let request = https.request(Object.assign(url.parse("https://www.googleapis.com/chromewebstore/v1.1/items/ggolfgbegefeeoocgjbmkembbncoadlb/publish"), {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "x-goog-api-version": "2",
                "Content-Length": "0",
            },
        }), (res) => {
            let data = "";
            res.setEncoding("utf8");
            res.on("data", (c) => { data += c; });
            res.on("error", () => {
                console.error("Could not publish new build: Could not connect to remote server.");
                process.exit(1);
            });
            res.on("end", () => {
                try {
                    const response = JSON.parse(data);
                    if (response.error) {
                        console.error("Could not publish new build: Remote server returned an error.");
                        secureErrorReport(`${secureErrorReportPrefix}Publish Failed`, data);
                    } else if (response.status.includes("OK")) {
                        console.log("New build is published.");
                        resolve();
                    } else if (response.status.includes("ITEM_PENDING_REVIEW")) {
                        console.log("New build is published, but it is currently under review.");
                        resolve();
                    } else {
                        console.error("Could not publish new build: Remote server returned an error.");
                        secureErrorReport(`${secureErrorReportPrefix}Publish Failed`, data);
                    }
                } catch (err) {
                    console.error("Could not publish new build: Could not parse response.");
                    process.exit(1);
                }
            });
        });
        request.on("error", () => {
            console.error("Could not publish new build: Could not connect to remote server.");
            process.exit(1);
        });
        request.end();
    });
};
/**
 * Save version number for next build.
 * Will fail the build if this task could not be completed. Will try 5 times.
 * @function
 * @param {Version} v - The version to set.
 * @return {Promise} The promise of the task.
 */
const setLastBuildVersion = (v) => {
    console.log("Saving version number for next build...");
    return new Promise((resolve) => {
        const onError = (() => {
            let errorCount = 0;
            return () => {
                console.error("Could not save version number for next build: Could not connect to remote server.");
                if ((++errorCount) > 5) {
                    console.error("Too many trails, aborting...");
                    process.exit(1);
                } else {
                    console.log("Retrying in 1 minute...");
                    setTimeout(doRequest, 60 * 1000);
                }
            };
        })();
        const doRequest = () => {
            let payload;
            try {
                payload = serialize({
                    key: process.env.VERSION_KEY,
                    data: v.toString(),
                });
            } catch (err) {
                console.error("Could not save version number for next build: Secure environment variables are invalid.");
                process.exit(1);
            }
            let request = https.request(Object.assign(url.parse(`${extendedAPIProvider}/API.php`), {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Content-Length": payload.length,
                },
            }), (res) => {
                let data = "";
                res.setEncoding("utf8");
                res.on("data", (c) => { data += c; });
                res.on("error", onError);
                res.on("end", () => {
                    if (data === "ok") {
                        resolve();
                    } else {
                        console.error("Could not save version number for next build: Remote server returned an error.");
                        secureErrorReport(`${secureErrorReportPrefix}Save Version Failed`, `\nPayload sent: ${payload}\nServer response: ${data}`);
                    }
                });
            });
            request.on("error", onError);
            request.write(payload);
            request.end();
        };
        doRequest();
    });
};

/**
 * Find published version number.
 * Will fail the build if this task could not be completed.
 * This function is not used.
 * @function
 * @return {Promise} The promise of the task.
 ** @param {Version} v1 - The version.
 */
const getPublishedVersion = () => {
    console.log("Obtaining published version number...");
    return new Promise((resolve) => {
        let request = https.request(url.parse("https://chrome.google.com/webstore/detail/ublock-protector-extensio/ggolfgbegefeeoocgjbmkembbncoadlb"), (res) => {
            let data = "";
            res.setEncoding("utf8");
            res.on("data", (c) => { data += c; });
            res.on("error", () => {
                console.error("Could not obtain published version number: Could not connect to remote server.");
                process.exit(1);
            });
            res.on("end", () => {
                let match;
                try {
                    match = (/<meta itemprop="version" content="(\d+\.\d+)" \/>/).exec(data);
                } catch (err) { } //Error handled below
                if (match) {
                    resolve(new Version(match[1]));
                } else {
                    console.error("Could not obtain published version number: Could not parse response.");
                    process.exit(1);
                }
            });
        });
        request.on("error", (err) => {
            console.error("Could not obtain published version number: Could not connect to remote server.");
            process.exit(1);
        });
        request.end();
    });
};
/**
 * Find version number of last build.
 * Will try 5 times, then default to 1.0.
 * @function
 * @return {Promise} The promise of the task.
 ** @param {Version} v1 - The version.
 */
const getLastBuildVersion = () => {
    console.log("Obtaining version number of last build...");
    return new Promise((resolve) => {
        const onError = (() => {
            let errorCount = 0;
            return () => {
                console.error("Could not obtain version number of last build: Could not connect to remote server.");
                if ((++errorCount) > 5) {
                    console.error("Too many trails, default to 1.0.");
                    resolve(new Version("1.0"));
                } else {
                    console.log("Retrying in 1 minute...");
                    setTimeout(doRequest, 60 * 1000);
                }
            };
        })();
        const doRequest = () => {
            let request = https.request(url.parse(`${extendedAPIProvider}/Data.txt`), (res) => {
                let data = "";
                res.setEncoding("utf8");
                res.on("data", (c) => { data += c; });
                res.on("error", onError);
                res.on("end", () => {
                    if ((/^\d+\.\d+$/).test(data)) {
                        resolve(new Version(data));
                    } else {
                        console.error("Could not obtain version number of last build: Unexpected response.");
                        onError();
                    }
                });
            });
            request.on("error", onError);
            request.end();
        };
        doRequest();
    });
};
/**
 * Find local version number.
 * Will fail the build if this task could not be completed.
 * @function
 * @return {Promise} The promise of the task.
 ** @param {Version} v2 - The version.
 */
const getLocalVersion = () => {
    console.log("Obtaining local version number...");
    return new Promise((resolve) => {
        fs.readFile("./Extension Compiler/Extension/manifest.json", { encoding: "utf8" }, (err, data) => {
            if (err) {
                console.error("Could not obtain local version number: Could not open manifest.");
                process.exit(1);
            } else {
                try {
                    const ver = JSON.parse(data).version;
                    if ((/^\d+\.\d+$/).test(ver)) {
                        resolve(new Version(ver));
                    } else {
                        console.error("Could not obtain local version number: Manifest is invalid.");
                        process.exit(1);
                    }
                } catch (err) {
                    console.error("Could not obtain local version number: Could not parse manifest.");
                    process.exit(1);
                }
            }
        });
    });
};

/**
 * Build and publish.
 * @function
 * @param {Version} newVer - The new version.
 */
const build = (newVer) => {
    //Upload and publish
    let data, token;
    disableDebugMode().then(() => {
        return zip();
    }).then((d) => {
        data = d;
        return OAuth2();
    }).then((t) => {
        token = t;
        return upload(token, data);
    }).then(() => {
        return publish(token);
    }).then(() => {
        return setLastBuildVersion(newVer);
    }).then(exit);
};

//Check if I have credentials, pull requests do not have access to credentials, I do not want to push to store for pull
//requests anyway, do not fail the build as that can cause confusions
if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.REFRESH_TOKEN || !process.env.VERSION_KEY) {
    console.log("Secure environment variables are missing, skipping build.");
    exit();
}
//Check do not build instruction
if (process.env.TRAVIS_COMMIT_MESSAGE.startsWith("@build-script-do-not-run")) {
    console.log("Do not build instruction received.");
    exit();
}
//Check force build instruction
if (process.env.TRAVIS_COMMIT_MESSAGE.startsWith("@build-script-force-run")) {
    console.warn("Force build instruction received.");
    //I still need to fetch local version since I need to save it at the end
    getLocalVersion().then(build);
} else {
    //Fetch versions
    Promise.all([
        getLastBuildVersion(),
        getLocalVersion(),
    ]).then((versions) => {
        if (verSame(...versions)) {
            //Nothing to do
            console.log("Store version up to date, nothing to build.");
            exit();
        } else if (verNeedUpdate(...versions)) {
            build(versions[1]);
        } else {
            //Version is broken
            console.error("Version error: Unexpected versions, maybe last build was not properly completed.");
            process.exit(1);
        }
    });
}
