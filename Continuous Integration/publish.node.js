/**
 * Publish a new version, this script will swallow all errors and only display hard coded generic
 * messages for security, some errors will be reported to a secure channel.
 *
 * Requires these secure environment variables:
 ** CLIENT_ID, CLIENT_SECRET: Client ID and secret
 ** REFRESH_TOKEN: Refresh token
 ** VERSION_KEY: Key used to save last build version
 *
 * If commit message starts with "@pragma-no-publish", then this script will do nothing and
 * immediately exit.
 * If commit message starts with "@pragma-force-publish", then version check is skipped.
 */
"use strict";


process.on("uncaughtException", (err) => {
    if (err !== abortMagic) {
        console.error("Unknown error, this is probably caused by a bug in the publish script");
    }
    //Must throw abort magic instead of the actual error
    throw abortMagic;
});
process.on("unhandledRejection", (err) => {
    //Error thrown here will go to uncaughtException handler
    throw err;
});


/**
 * The error to throw if the error is not unknown.
 * @const {Error}
 */
const abortMagic = new Error(`AbortMagic_${Math.random().toString(36).substring(2)}`);

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
    console.error("Could not find archiver module");
    throw abortMagic;
}

/**
 * The directory to package.
 * @const {string}
 */
const packageDirectory = "./Extension Compiler/Extension";
/**
 * The provider of extended API.
 * @const {string}
 */
const extendedAPIProvider = "https://jspenguin.com/uBlockProtector";
/**
 * The provider of secure error reporting channel.
 * @const {string}
 */
const secureErrorReportProvider = "https://jspenguin.com/PrivateMessage/API.php";
/**
 * The prefix of error report reference.
 * @const {string}
 */
const secureErrorReportPrefix = "Nano Defender Publish Script ";

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
 * @function
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
            throw new Error("Invalid Parameter");
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
    if (typeof ref !== "string" || typeof err !== "string") {
        console.error("Could not report error, reference or message is not valid");
        throw abortMagic;
    }
    const payload = `send\n${ref}\n${err}`;

    let request = https.request(Object.assign(url.parse(secureErrorReportProvider), {
        method: "POST",
        headers: {
            "Content-Length": Buffer.byteLength(payload),
        },
    }), (res) => {
        let data = "";
        res.setEncoding("utf8");
        res.on("data", (c) => { data += c; });
        res.on("error", () => {
            console.error("Could not report error, connection error");
            throw abortMagic;
        });
        res.on("end", () => {
            if (data === "ok") {
                console.log("Error reported");
            } else {
                console.error("Could not report error, remote server returned an error");
            }
            throw abortMagic;
        });
    });
    request.on("error", () => {
        console.error("Could not report error, connection error");
        throw abortMagic;
    });
    request.write(payload);
    request.end();
};

/**
 * Find published version number.
 * Will fail the build if this task could not be completed.
 * @function
 * @return {Promise} The promise of the task.
 ** @param {Version} v1 - The version.
 */
const getPublishedVersion = () => {
    console.log("Obtaining published version number...");
    return new Promise((resolve) => {
        let request = https.request(url.parse("https://chrome.google.com/webstore/detail/nano-defender/ggolfgbegefeeoocgjbmkembbncoadlb"), (res) => {
            let data = "";
            res.setEncoding("utf8");
            res.on("data", (c) => { data += c; });
            res.on("error", () => {
                console.error("Could not obtain published version number, connection error");
                throw abortMagic;
            });
            res.on("end", () => {
                let match = (/<meta itemprop="version" content="(\d+\.\d+)"\/>/).exec(data);
                if (match) {
                    resolve(new Version(match[1]));
                } else {
                    console.error("Could not obtain published version number, unexpected response");
                    throw abortMagic;
                }
            });
        });
        request.on("error", (err) => {
            console.error("Could not obtain published version number, connection error");
            throw abortMagic;
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
            return (doLog = true) => {
                doLog && console.error("Could not obtain version number of last build, connection error");
                if ((++errorCount) > 5) {
                    console.error("Too many trails, default to 1.0");
                    resolve(new Version("1.0"));
                } else {
                    console.log("Retrying in 1 minute...");
                    setTimeout(doRequest, 60 * 1000);
                }
            };
        })();
        const doRequest = () => {
            let request = https.request(url.parse(`${extendedAPIProvider}/Version`), (res) => {
                let data = "";
                res.setEncoding("utf8");
                res.on("data", (c) => { data += c; });
                res.on("error", onError);
                res.on("end", () => {
                    if ((/^\d+\.\d+$/).test(data)) {
                        resolve(new Version(data));
                    } else {
                        console.error("Could not obtain version number of last build, unexpected response");
                        onError(false);
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
                console.error("Could not obtain local version number, could not open manifest");
                throw abortMagic;
            } else {
                let ver;
                try {
                    ver = JSON.parse(data).version;
                } catch (err) {
                    console.error("Could not obtain local version number, unparsable manifest");
                    throw abortMagic;
                }
                if ((/^\d+\.\d+$/).test(ver)) {
                    resolve(new Version(ver));
                } else {
                    console.error("Could not obtain local version number, manifest does not contain a valid version");
                    throw abortMagic;
                }
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
            console.error("Could not create archive");
            throw abortMagic;
        });
        archive.on("error", () => {
            console.error("Could not create archive");
            throw abortMagic;
        });
        archive.on("data", (c) => { data.push(c); });
        archive.on("end", () => {
            resolve(Buffer.concat(data));
        });
        archive.directory(packageDirectory, false);
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
        let payload;
        try {
            payload = serialize({
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                refresh_token: process.env.REFRESH_TOKEN,
                grant_type: "refresh_token",
            });
        } catch (err) {
            console.error("Could not obtain access token, secure environment variables are invalid");
            throw abortMagic;
        }

        let request = https.request(Object.assign(url.parse("https://accounts.google.com/o/oauth2/token"), {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": Buffer.byteLength(payload),
            },
        }), (res) => {
            let data = "";
            res.setEncoding("utf8");
            res.on("data", (c) => { data += c; });
            res.on("error", () => {
                console.error("Could not obtain access token, connection error");
                throw abortMagic;
            });
            res.on("end", () => {
                let response
                try {
                    response = JSON.parse(data);
                } catch (err) {
                    console.error("Could not obtain access token, unparsable response");
                    throw abortMagic;
                }
                if (response.error || typeof response.access_token !== "string") {
                    console.error("Could not obtain access token, remote server returned an error");
                    secureErrorReport(`${secureErrorReportPrefix}OAuth2 Error`, data);
                } else {
                    resolve(response.access_token);
                }
            });
        });
        request.on("error", () => {
            console.error("Could not obtain access token, connection error");
            throw abortMagic;
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
                console.error("Could not upload new build, connection error");
                throw abortMagic;
            });
            res.on("end", () => {
                let response;
                try {
                    response = JSON.parse(data);
                } catch (err) {
                    console.error("Could not upload new build, unparsable response");
                    throw abortMagic;
                }
                if (response.uploadState === "SUCCESS") {
                    resolve();
                } else if (response.uploadState === "IN_PROGRESS") {
                    console.log("Remote server is processing the uploaded package, continuing in 1 minute...");
                    setTimeout(resolve, 60 * 1000); //Wait a minute
                } else {
                    console.error("Could not upload new build, remote server returned an error");
                    secureErrorReport(`${secureErrorReportPrefix}Upload Failed`, data);
                }
            });
        });
        request.on("error", () => {
            console.error("Could not upload new build, connection error");
            throw abortMagic;
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
                "X-Goog-API-Version": "2",
                "Content-Length": "0",
            },
        }), (res) => {
            let data = "";
            res.setEncoding("utf8");
            res.on("data", (c) => { data += c; });
            res.on("error", () => {
                console.error("Could not publish new build, connection error");
                throw abortMagic;
            });
            res.on("end", () => {
                let response;
                try {
                    response = JSON.parse(data);
                } catch (err) {
                    console.error("Could not publish new build, unparsable response");
                    throw abortMagic;
                }
                if (response.error) {
                    console.error("Could not publish new build, remote server returned an error");
                    secureErrorReport(`${secureErrorReportPrefix}Publish Failed`, data);
                } else if (response.status.includes("OK")) {
                    console.log("New build is published");
                    resolve();
                } else if (response.status.includes("ITEM_PENDING_REVIEW")) {
                    console.log("New build is published, but it is currently under review");
                    resolve();
                } else {
                    console.error("Could not publish new build, remote server returned an error");
                    secureErrorReport(`${secureErrorReportPrefix}Publish Failed`, data);
                }
            });
        });
        request.on("error", () => {
            console.error("Could not publish new build, connection error");
            throw abortMagic;
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
                console.error("Could not save version number for next build, connection error");
                if ((++errorCount) > 5) {
                    console.error("Too many trails, aborting...");
                    throw abortMagic;
                } else {
                    console.log("Retrying in 1 minute...");
                    setTimeout(doRequest, 60 * 1000);
                }
            };
        })();
        const doRequest = () => {
            if (typeof process.env.VERSION_KEY !== "string") {
                console.error("Could not save version number for next build, secure environment variables are invalid");
                throw abortMagic;
            }
            const payload = `${process.env.VERSION_KEY}\n${v.toString()}`;
            let request = https.request(Object.assign(url.parse(`${extendedAPIProvider}/VersionWrite.php`), {
                method: "POST",
                headers: {
                    "Content-Length": Buffer.byteLength(payload),
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
                        console.error("Could not save version number for next build, remote server returned an error");
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


//Check if I have credentials, pull requests do not have access to credentials, I do not want to push to store for pull
//requests anyway, do not fail the build as that can cause confusions
if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.REFRESH_TOKEN || !process.env.VERSION_KEY) {
    console.warn("Secure environment variables are missing, publish skipped");
} else {
    if (process.env.TRAVIS_COMMIT_MESSAGE.startsWith("@pragma-no-publish")) {
        console.log("No publish instruction received");
    } else {
        (async () => {
            const doPublish = async (newVer) => {
                const data = await zip();
                const token = await OAuth2();
                await upload(token, data);
                await publish(token);
                await setLastBuildVersion(newVer);
                console.log("Done");
            };

            if (process.env.TRAVIS_COMMIT_MESSAGE.startsWith("@pragma-force-publish")) {
                console.log("Force publish instruction received");
                await doPublish(await getLocalVersion());
            } else {
                const [remoteVer, localVer] = await Promise.all([
                    getLastBuildVersion(),
                    //getPublishedVersion(),

                    getLocalVersion(),
                ]);

                if (verSame(remoteVer, localVer)) {
                    console.log("Store version up to date, nothing to build");
                } else if (verNeedUpdate(remoteVer, localVer)) {
                    await doPublish(localVer);
                } else {
                    console.error("Version error, maybe last build was not properly completed");
                    throw abortMagic;
                }
            }
        })();
    }
}
