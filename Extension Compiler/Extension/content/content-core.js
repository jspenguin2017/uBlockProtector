//The content core library for content rules
"use strict";

//=====Initializer=====
/**
 * Initialization.
 * @function
 */
a.init = () => {
    //Log domain
    console.warn(`Domain: ${document.domain}`);
    //Home page installation test
    if (a.domCmp(["jspenguin2017.github.io"], true) && location.pathname.startsWith("/uBlockProtector/")) {
        a.inject(() => {
            "use strict";
            window.uBlock_Protector_Extension = true;
        });
    }
};

//=====Utilities=====
/**
 * Whether this frame is top frame.
 * @const {boolean}
 */
a.isTopFrame = (() => {
    try {
        return window.self === window.top;
    } catch (err) {
        //Top frame not accessible due to security policy
        return false;
    }
})();
/**
 * Shortcut for addEventListener(...args).
 * @const {Function}
 */
a.on = (...args) => { addEventListener(...args); };
/**
 * Shortcut for addEventListener("DOMContentLoaded", ...args).
 * @const {Function}
 */
a.ready = (...args) => { addEventListener("DOMContentLoaded", ...args); }
/**
 * Run function that is passed in on document-start, document-idle, and document-end.
 * @function
 * @param {Special} ...args - ...args in addEventListener("...", ...args).
 */
a.always = (...args) => {
    args[0]();
    a.on("DOMContentLoaded", ...args);
    a.on("load", ...args);
};
/**
 * Write an error message to console.
 * @function
 * @param {string} [name=undefined] - The name of the AdBlocker detector if available.
 */
a.err = (name) => {
    if (name) {
        console.error(`Uncaught Error: ${name} uBlock Origin detector is not allowed on this device!`);
    } else {
        console.error("Uncaught Error: uBlock Origin detectors are not allowed on this device!");
    }
};
/**
 * Do a cross origin request.
 * @function
 * @param {Object} details - Details about this request.
 ** @param {string} method - The method of the request, usually "GET" or "POST".
 ** @param {string} url - The URL of the request.
 ** @param {Object|undefined} [headers=undefined] - The headers of the request.
 ** @param {string|null} [payload=null] - The payload of the request.
 * @param {Function} onload - The load event handler.
 ** @param {string} response - The response text.
 * @param {Function} onerror - The error event handler.
 */
a.request = (details, onload, onerror) => {
    chrome.runtime.sendMessage({
        cmd: "xhr",
        details: details,
    }, (response) => {
        if (response === null) {
            onerror();
        } else {
            onload(response);
        }
    });
};
/**
 * Check if current domain ends with one of the domains in the list.
 * "example.com" will match domains that matches /(^|.*\.)example\.com$/.
 * @function
 * @param {Array.<string>} domList - The list of domains to compare.
 * @param {boolean} [noErr=false] - Set to true to prevent showing error message.
 * @return {boolean} True if current domain is in the list, false otherwise.
 */
a.domCmp = (domList, noErr) => {
    //Loop though each element
    for (let i = 0; i < domList.length; i++) {
        if (document.domain.endsWith(domList[i]) &&
            (document.domain.length === domList[i].length ||
                document.domain.charAt(document.domain.length - domList[i].length - 1) === '.')) {
            !noErr && a.err();
            return true;
        }
    }
    return false;
};
/**
 * Same as a.domCmp(), but only compare one domain.
 * @function
 * @param {string} dom - The domain to compare.
 */
/*
//Does not make a difference
a.domCmpOnce = (dom, noErr) => {
    if (document.domain.endsWith(dom) &&
        (document.domain.length === dom.length ||
            document.domain.charAt(document.domain.length - dom.length - 1) === '.')) {
        !noErr && a.err();
        return true;
    } else {
        return false;
    }
};
*/
/**
 * Check if current domain includes one of the strings that is in the list.
 * "example" will match domains that matches /(^|.*\.)example\.[^\.]*$/.
 * "git.example" will match domains that matches /(^|.*\.)git\.example\.[^\.]*$/.
 * @function
 * @param {Array.<string>} domList - The list of strings to compare.
 * @param {boolean} [noErr=false] - Set to true to prevent showing error message.
 * @return {boolean} True if current domain is in the list, false otherwise.
 */
a.domInc = (domList, noErr) => {
    //Loop though each element
    for (let i = 0; i < domList.length; i++) {
        let index = document.domain.lastIndexOf(domList[i] + ".");
        //Make sure the character before, if exists, is "."
        if (index > 0 && document.domain.charAt(index - 1) !== '.') {
            continue;
        }
        if (index > -1) {
            if (!document.domain.substring(index + domList[i].length + 1).includes(".")) {
                !noErr && a.err();
                return true;
            }
        }
    }
    return false;
};
/**
 * Same as a.domInc(), but only compare one domain.
 * @function
 * @param {string} dom - The domain to compare.
 */
/*
//Does not make a difference
a.domIncOnce = (dom, noErr) => {
    let index = document.domain.lastIndexOf(dom + ".");
    //Make sure the character before, if exists, is "."
    if (index > 0 && document.domain.charAt(index - 1) !== '.') {
        return false;
    }
    if (index > -1) {
        if (!document.domain.substring(index + dom.length + 1).includes(".")) {
            !noErr && a.err();
            return true;
        }
    }
    return false;
};
*/
/**
 * Match methods.
 * @const {Enumeration}
 */
a.matchMethod = {
    /**
     * Match all.
     * @param {undefined|null} [filter=undefined] - The filter.
     */
    matchAll: 0,
    /**
     * Partial string match. Result in match if one of the arguments contains the filter.
     * @param {string} filter - The filter.
     */
    string: 1,
    /**
     * Exact string match. Result in match if one of the arguments is exactly the filter.
     * @param {string} filter - The filter.
     */
    stringExact: 2,
    /**
     * Regular expression based matching, filter.test() will be used to apply matching.
     * @param {RegExp} filter - The filter.
     */
    RegExp: 3,
};
/**
 * Get a matcher, the filter will be "hard coded" into it.
 * @function
 * @param {Enumeration} method - The method to use.
 * @param {undefined|string|RegExp} filter - An appropriate filter. Escape it if needed, string filters are
 ** wrapped in double quotes.
 * @return {string} A matcher function.
 */
a.getMatcher = (method, filter) => {
    switch (method) {
        case a.matchMethod.string:
            return `(args) => {
                for (let i = 0; i < args.length; i++) {
                    if (String(args[i]).includes("${filter}")) {
                        return true;
                    }
                }
                return false;
            }`;
        case a.matchMethod.stringExact:
            return `(args) => {
                for (let i = 0; i < args.length; i++) {
                    if ("${filter}" === String(args[i])) {
                        return true;
                    }
                }
                return false;
            }`;
        case a.matchMethod.RegExp:
            return `(args) => {
                const matcher = ${filter};
                for (let i = 0; i < args.length; i++) {
                    if (matcher.test(String(args[i]))) {
                        return true;
                    }
                }
                return false;
            }`;
            break;
        default:
            //Match all
            return `() => true`;
    }
};
/**
 * Inject standalone script to the page.
 * @function
 * @param {string|Function} payload - The script to inject.
 * @param {boolean} [isReady=false] - Set this to true if the payload does not need a wrapper.
 */
a.inject = (payload, isReady) => {
    let s = document.createElement("script");
    s.textContent = isReady ? payload : `(${payload})();`;
    try {
        document.documentElement.prepend(s);
        s.remove();
    } catch (err) {
        console.error("uBlock Protector failed to inject a standalone script!");
        if (a.debugMode) {
            console.error(s.textContent);
        }
    }
};
/**
 * Serialize an object into GET request parameters.
 * Source: http://stackoverflow.com/questions/6566456/how-to-serialize-an-object-into-a-list-of-parameters
 * @function
 * @param {Object} obj - The object to serialize, can be at most 1 level deep.
 * @return {string} The serialized string.
 */
a.serialize = (obj) => {
    let str = "";
    for (let key in obj) {
        if (str !== "") {
            str += "&";
        }
        str += `${key}=${encodeURIComponent(obj[key])}`;
    }
    return str;
};
/**
 * Returns a unique ID which is also a valid variable name.
 * @function
 * @return {string} The unique ID.
 */
a.uid = (() => {
    let counter = 0;
    return () => {
        const chars = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let str = "";
        for (let i = 0; i < 10; i++) {
            str += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return str + (counter++).toString();
    };
})();
/**
 * Set up DOM insert observer.
 * @function
 * @param {Function} handler - The mutation handler.
 ** @param {HTMLElement} insertedNode - The inserted node.
 */
a.onInsert = (handler) => {
    const observer = new MutationObserver((mutations) => {
        for (let i = 0; i < mutations.length; i++) {
            if (mutations[i].addedNodes.length) {
                for (let j = 0; j < mutations[i].addedNodes.length; j++) {
                    handler(mutations[i].addedNodes[j]);
                }
            }
        }
    });
    observer.observe(document, {
        childList: true,
        subtree: true,
    });
};

//=====Solutions=====
/**
 * Inject CSS, "!important" will be added automatically.
 * @function
 * @param {string} code - The CSS to inject.
 * @param {boolean} [stealthy=false] - Whether the style should only be injected from background page only, this will
 ** not carete a style element, but the injected style have a lower priority. The injection from background is asynchronous.
 */
a.css = (() => {
    const reMatcher = /;/g;
    return (code, stealthy) => {
        const payload = code.replace(reMatcher, " !important;");
        //Add from background page
        chrome.runtime.sendMessage({
            cmd: "inject css",
            data: payload,
        });
        if (!stealthy) {
            //Add directly
            let s = document.createElement("style");
            s.textContent = payload;
            document.documentElement.append(s);
        }
    };
})();
/**
 * Add a bait element, this sometimes has a side effect that adds an empty bar on top of the page.
 * Sometimes the height of the bait element is checked, so I cannot make it 0 height.
 * @function
 * @param {string} type - The type of the element, example: div.
 * @param {string} identifier - The class or id, example: .test (class), #test (id).
 * @param {boolean} [hidden=false] - Whether the element should be hidden.
 */
a.bait = (type, identifier, hidden) => {
    //Create element
    let elem = document.createElement(type);
    //Add identifier
    switch (identifier.charAt(0)) {
        case '#':
            elem.id = identifier.substring(1);
            break;
        case '.':
            elem.className = identifier.substring(1);
            break;
    }
    //Hide element if needed
    if (hidden) {
        elem.style.display = "none";
    }
    //Add content and prepend to HTML
    elem.innerHTML = "<br>";
    document.documentElement.prepend(elem);
};
/**
 * Filter a function, must be called on document-start.
 * @function
 * @param {string} name - The name of the function. Escape double quotes if needed.
 * @param {Enumeration} [method=a.matchMethod.matchAll] - An option from a.matchMethods, omit or pass null defaults
 ** to match all.
 * @param {undefined|string|RegExp} filter - The filter to apply, this must be appropriate for the method.
 * @param {string} [parent="window"] - The name of the parent object, use "." or bracket notation to separate layers.
 ** Escape double quotes if needed.
 */
a.filter = (name, method, filter, parent = "window") => {
    a.inject(`(() => {
        "use strict";
        let matcher = ${a.getMatcher(method, filter)};
        //Cache console functions as some web pages do change them
        const info = window.console.info.bind(window.console);
        const warn = window.console.warn.bind(window.console);
        const error = window.console.error.bind(window.console);
        //The original funciton, will be set later
        let parent, original;
        //The replacement function with filters
        const newFunc = (...args) => {
            //Call log
            if (${a.debugMode}) {
                warn("${parent}.${name} is called with these arguments:");
                for (let i = 0; i < args.length; i++) {
                    warn(String(args[i]));
                }
            }
            //Apply filter
            if (matcher(args)) {
                //Not allowed log
                error("Uncaught Error: uBlock Origin detectors are not allowed on this device!");
            } else {
                //Allowed log
                info("Tests passed.");
                return original.apply(parent, args);
            }
        };
        //Try to replace the function
        try {
            parent = ${parent};
            original = ${parent}["${name}"];
            //Replace
            ${parent}["${name}"] = newFunc;
            //Activate log
            warn("Filter activated on ${parent}.${name}");
        } catch (err) {
            //Failed to activate
            error("uBlock Protector failed to activate filter on ${parent}.${name}!");
        }
    })();`, true);
};
/**
 * Change the execution delay for setTimeout or setInterval, must be called on document-start.
 * @function
 * @param {string} timer - The name of the timer to patch, can be "setTimeout" or "setInterval".
 * @param {Enumeration} [method=method=a.matchMethod.matchAll] - An option from a.matchMethods, omit or pass null defaults
 ** to match all.
 * @param {undefined|string|RegExp} filter - The filter to apply, this must be appropriate for the method.
 * @param {float} [ratio=0.02] - The boost ratio, between 0 and 1 for speed up, larger than 1 for slow down, defaults to
 ** speed up 50 times.
 */
a.timewarp = (timer, method, filter, ratio = 0.02) => {
    a.inject(`(() => {
        "use strict";
        let matcher = ${a.getMatcher(method, filter)};
        //Cache console functions as some web pages do change them
        const info = window.console.info.bind(window.console);
        const warn = window.console.warn.bind(window.console);
        const error = window.console.error.bind(window.console);
        //The original funciton, will be set later
        let original;
        //The replacement function with filters
        const newFunc = (...args) => {
            //Call log
            if (${a.debugMode}) {
                warn("window.${timer} is called with these arguments:");
                for (let i = 0; i < args.length; i++) {
                    warn(String(args[i]));
                }
            }
            //Apply filter
            if (matcher(args)) {
                error("Timewarped.");
                args[1] *= ${ratio};
            } else {
                info("Not timewarped.");
            }
            return original.apply(window, args);
        };
        //Try to replace the function
        try {
            original = window.${timer};
            //Replace
            window.${timer} = newFunc;
            //Activate log
            warn("Timewarp activated on window.${timer}");
        } catch (err) {
            //Failed to activate
            error("uBlock Protector failed to activate filter on window.${timer}!");
        }
    })();`, true);
};
/**
 * Defines a read-only property, must be called on document-start.
 * May not be able to lock the property's own properties.
 * @function
 * @param {string} name - The name of the property to define. Escape double quotes if needed.
 * @param {Any} val - The value to set, must have extra quotes if it is a literal string. If it is a funciton,
 ** it will lose its scope, if it is an object, you are responsible in making it into a string.
 * @param {string} [parent="window"] - The name of the parent object, use "." or bracket notation to separate layers.
 ** Escape double quotes if needed.
 */
a.readOnly = (name, val, parent = "window") => {
    a.inject(`(() => {
        "use strict";
        const val = ${val};
        //This is synchronous so I do not need to cache the reference of the console functions
        try {
            window.Object.defineProperty(${parent}, "${name}", {
                configurable: false,
                set() { },
                get() {
                    return val;
                },
            });
            if (${a.debugMode}) {
                window.console.warn("Defined read-only property ${parent}.${name}");
            }
        } catch (err) {
            window.console.error("uBlock Protector failed to define read-only property ${parent}.${name}!");
        }
    })();`, true);
};
/**
 * Defines a non-accessible property, must be called on document-start.
 * @function
 * @param {string} name - The name of the property to define. Escape double quotes if needed.
 * @param {string} [parent="window"] - The name of the parent object, use "." or bracket notation to separate layers.
 ** Escape double quotes if needed.
 */
a.noAccess = (name, parent = "window") => {
    a.inject(`(() => {
        "use strict";
        const err = new window.Error("This property may not be accessed!");
        try {
            window.Object.defineProperty(${parent}, "${name}", {
                configurable: false,
                set() {
                    throw err;
                },
                get() {
                    throw err;
                },
            });
            if (${a.debugMode}) {
                window.console.warn("Defined non-accessible property ${parent}.${name}");
            }
        } catch (err) {
            window.console.error("uBlock Protector failed to define non-accessible property ${parent}.${name}!");
        }
    })();`, true);
};
/**
 * Set or get a cookie.
 * @function
 * @param {string} key - The key of the cookie.
 * @param {string} [val=undefined] - The value to set, omit this to get the cookie.
 * @param {integer} [time=31536000000] - In how many milliseconds will it expire, defaults to 1 year.
 * @param {string} [path="/"] - The path to set.
 * @return {string|null|undefined} The value of the cookie, null will be returned if the cookie does not exist, and undefined
 ** will be returned in set mode.
 */
a.cookie = (key, val, time = 31536000000, path = "/") => {
    if (val === undefined) {
        //Get mode
        const cookies = document.cookie;
        const i = cookies.indexOf(`${key}=`);
        const j = cookies.indexOf(";", i);
        if (i === -1) {
            //Not found
            return null;
        } else {
            if (j === -1) {
                //Goes to the end
                return cookies.substring(i + key.length + 1);
            } else {
                //Extract the value
                return cookies.substring(i + key.length + 1, j);
            }
        }
    } else {
        //Set mode
        let expire = new Date();
        expire.setTime(expire.getTime() + time);
        document.cookie = `${key}=${encodeURIComponent(val)};expires=${expire.toGMTString()};path=${path}`;
    }
};
/**
 * Generate a native HTML5 player with controls but not autoplay.
 * @function
 * @param {string} source - The source of the video.
 * @param {string} [type=(Auto Detect)] - The type of the video, will be automatically detected if not supplied, defaults to MP4
 ** if detection failed.
 * @param {string} [width="100%"] - The width of the player.
 * @param {string} [height="auto"] - The height of the player.
 * @return {string} An HTML string of the video player.
 */
a.nativePlayer = (source, type, width = "100%", height = "auto") => {
    //Detect type
    if (!type) {
        const i = source.lastIndexOf(".");
        let temp;
        if (i > -1) {
            temp = source.substring(i + 1);
        }
        switch (temp) {
            case "webm":
                type = "video/webm";
                break;
            case "mp4":
                type = "video/mp4";
                break;
            case "ogg":
                type = "video/ogg";
                break;
            default:
                //Defaults to MP4
                type = "video/mp4";
                break;
        }
    }
    //Construct HTML string
    return `<video width="${width}" height="${height}" controls><source src="${source}" type="${type}" /></video>`;
};
/**
 * Install XMLHttpRequest loopback engine.
 * @function
 * @param {Function} server - The loopback server.
 ** @param {Any} ...args - The arguments supplied to open.
 ** @return {string|null} Return a string to override the result of this request, return null to not interfere.
 *** The request will always be sent, so event handlers can be triggered properly.
 */
a.loopback = (server) => {
    a.inject(`(() => {
        "use strict";
        const server = ${server};
        let original; //XMLHttpRequest
        const newXHR = function (...args) {
            const wrapped = new (window.Function.prototype.bind.apply(original, args));
            const _open = wrapped.open;
            wrapped.open = function (...args) {
                const data = server(...args);
                if (data !== null) {
                    window.Object.defineProperty(this, "responseText", {
                        configurable: false,
                        set() { },
                        get() {
                            return data;
                        },
                    });
                    window.Object.defineProperty(this, "status", {
                        configurable: false,
                        set() { },
                        get() {
                            return 200;
                        },
                    });
                }
                return _open.apply(wrapped, args);
            };
            return wrapped;
        };
        try {
            original = window.XMLHttpRequest;
            window.XMLHttpRequest = newXHR;
        } catch (err) {
            window.console.error("uBlock Protector failed to set up XMLHttpRequest loopback engine!");
        }
    })();`, true);
};
/**
 * Forcefully close the current tab.
 * @function
 */
a.forceClose = () => {
    chrome.runtime.sendMessage({
        cmd: "remove tab",
    });
};

//=====Generic=====
/**
 * Apply generic solutions, must be called on document-start.
 * @function
 */
a.generic = () => {
    //Based on generic solutions of Anti-Adblock Killer, modified to fit my Core API
    //License: https://github.com/reek/anti-adblock-killer/blob/master/LICENSE
    //========================
    //=====Content Script=====
    //========================
    //---document-start---
    //FuckAdBlock
    a.generic.FuckAdBlock("FuckAdBlock", "fuckAdBlock");
    a.generic.FuckAdBlock("BlockAdBlock", "blockAdBlock");
    //ads.js
    a.readOnly("canRunAds", true);
    a.readOnly("canShowAds", true);
    a.readOnly("isAdBlockActive", false);
    //---document-idle---
    a.ready(() => {
        //AdBlock Alerter (WP)
        if ($("div.adb_overlay > div.adb_modal_img").length) {
            //Log
            a.err("AdBlock Alerter");
            //Remove alert and allow scrolling
            $("div.adb_overlay").remove();
            a.css("html, body { height:auto; overflow:auto; }");
        }
        //Generic block screens
        {
            const elem = document.getElementById("blockdiv");
            if (elem && elem.innerHTML === "disable ad blocking or use another browser without any adblocker when you visit") {
                //Log
                console.error("Uncaught Error: Generic block screens are not allowed on this device!");
                //Remove block screen
                elem.remove();
            }
        }
    });
    //---on-insert---
    const re1 = /^[a-z0-9]{4}$/;
    const re2 = /^a[a-z0-9]{6}$/;
    //AntiAdblock (Packer)
    const reIframeId = /^(zd|wd)$/;
    const reImgId = /^(xd|gd)$/;
    const reImgSrc = /\/ads\/banner.jpg/;
    const reIframeSrc = /(\/adhandler\/|\/adimages\/|ad.html)/;
    //Adunblock
    const reId = /^[a-z]{8}$/;
    const reClass = /^[a-z]{8} [a-z]{8}/;
    const reBg = /^[a-z]{8}-bg$/;
    //Handler
    const onInsertHandler = (insertedNode) => {
        //No-Adblock
        if (insertedNode.nodeName === "DIV" &&
            insertedNode.id &&
            insertedNode.id.length === 4 &&
            re1.test(insertedNode.id) &&
            insertedNode.firstChild &&
            insertedNode.firstChild.id &&
            insertedNode.firstChild.id === insertedNode.id &&
            insertedNode.innerHTML.includes("no-adblock.com")) {
            //Log
            a.err("No-Adblock");
            //Remove element
            insertedNode.remove();
        }
        //NoAdBlock
        if (insertedNode.nodeName === "CLOUDFLARE-APP" &&
            insertedNode.getAttribute("app-id") === "no-adblock") {
            //Log
            a.err("NoAdBlock");
            //Remove element
            insertedNode.remove();
            //Enable scrolling
            $("body").rmClass("adbmodal-cloudflare-open");
            //a.css("html, body { overflow:scroll; }");
        }
        //StopAdblock
        if (insertedNode.nodeName === "DIV" &&
            insertedNode.id &&
            insertedNode.id.length === 7 &&
            re2.test(insertedNode.id) &&
            insertedNode.parentNode &&
            insertedNode.parentNode.id &&
            insertedNode.parentNode.id === insertedNode.id + "2" &&
            insertedNode.innerHTML.includes("stopadblock.org")) {
            //Log
            a.err("StopAdblock");
            //Remove element
            insertedNode.remove();
        }
        //AntiAdblock (Packer)
        if (insertedNode.id &&
            reImgId.test(insertedNode.id) &&
            insertedNode.nodeName === "IMG" &&
            reImgSrc.test(insertedNode.src) ||
            insertedNode.id &&
            reIframeId.test(insertedNode.id) &&
            insertedNode.nodeName === "IFRAME" &&
            reIframeSrc.test(insertedNode.src)) {
            //Log
            a.err("AntiAdblock");
            //Remove element
            insertedNode.remove();
        }
        //Adunblock
        if (window.vtfab !== undefined &&
            window.adblock_antib !== undefined &&
            insertedNode.parentNode &&
            insertedNode.parentNode.nodeName === "BODY" &&
            insertedNode.id &&
            reId.test(insertedNode.id) &&
            insertedNode.nodeName === "DIV" &&
            insertedNode.nextSibling &&
            insertedNode.nextSibling.className &&
            insertedNode.nextSibling.nodeName === "DIV") {
            if (insertedNode.className &&
                reClass.test(insertedNode.className) &&
                reBg.test(insertedNode.nextSibling.className) &&
                insertedNode.nextSibling.style &&
                insertedNode.nextSibling.style.display !== "none") {
                //Log
                a.err("Adunblock Premium");
                //Full Screen Message (Premium)
                insertedNode.nextSibling.remove();
                insertedNode.remove();
            } else if (insertedNode.nextSibling.id &&
                reId.test(insertedNode.nextSibling.id) &&
                insertedNode.innerHTML.includes("Il semblerait que vous utilisiez un bloqueur de publicité !")) {
                //Log
                a.err("Adunblock Free");
                //Top bar Message (Free)
                insertedNode.remove();
            }
        }
    };
    a.onInsert(onInsertHandler);
    //==================
    //=====Injected=====
    //==================
    a.inject(() => {
        "use strict";
        let data = {};
        //---Initialization---
        const error = window.console.error.bind(window.console);
        const err = (name) => {
            error(`Uncaught Error: ${name} uBlock Origin detector is not allowed on this device!`);
        };
        //---document-start---
        //Playwire
        try {
            const errMsg = "Uncaught Error: Playwire uBlock Origin detector is not allowed on this device!";
            let playwireZeus;
            window.Object.defineProperty(window, "Zeus", {
                configurable: false,
                set(val) {
                    playwireZeus = val;
                },
                get() {
                    //Patch and return
                    try {
                        playwireZeus.AdBlockTester = {
                            check(a) {
                                error(errMsg);
                                a();
                            },
                        };
                    } catch (err) { }
                    return playwireZeus;
                },
            });
        } catch (err) {
            error("uBlock Protector failed to set up Playwire uBlock Origin detector defuser!");
        }
        //---document-idle---
        window.addEventListener("DOMContentLoaded", () => {
            //AdBlock Detector (XenForo Rellect)
            if (window.XenForo && typeof window.XenForo.rellect === "object") {
                //Log
                err("XenForo");
                //Patch detector
                window.XenForo.rellect = {
                    AdBlockDetector: {
                        start() { },
                    },
                };
            }
            //Adbuddy
            if (typeof window.closeAdbuddy === "function") {
                //Log
                err("Adbuddy");
                //Disable
                window.closeAdbuddy();
            }
            //Antiblock.org v2
            (() => {
                const re = /^#([a-z0-9]{4,10}) ~ \* \{ display: none; \}/;
                const styles = window.document.querySelectorAll("style");
                for (let i = 0; i < styles.length; i++) {
                    const style = styles[i];
                    const cssRules = style.sheet.cssRules;
                    for (var j = 0; j < cssRules.length; j++) {
                        const cssRule = cssRules[j];
                        const cssText = cssRule.cssText;
                        if (re.test(cssText)) {
                            const id = re.exec(cssText)[1];
                            const scripts = window.document.querySelectorAll("script");
                            for (let k = 0; k < scripts.length; k++) {
                                if (scripts[k].textContent.includes(`w.addEventListener('load',${id},false)`)) {
                                    //Log
                                    err("Antiblock.org v2");
                                    //Set data for future uses
                                    data.abo2 = id;
                                    return;
                                }
                            }
                        }
                    }
                }
            })();
            //BetterStopAdblock, Antiblock.org v3, and BlockAdBlock
            {
                const re = /^[a-z0-9]{4,12}$/i;
                for (let prop in window) {
                    try {
                        if (!prop.startsWith("webkit") &&
                            prop !== "document" &&
                            re.test(prop) &&
                            (window[prop] instanceof window.HTMLDocument) === false &&
                            window.hasOwnProperty(prop) &&
                            typeof window[prop] === "object") {
                            const method = window[prop];
                            //BetterStopAdblock and Antiblock.org v3
                            if (method.deferExecution &&
                                method.displayMessage &&
                                method.getElementBy &&
                                method.getStyle &&
                                method.insert &&
                                method.nextFunction) {
                                if (method.toggle) {
                                    //Log
                                    err("BetterStopAdblock");
                                    //Set data for future uses
                                    data.bsa = prop;
                                } else {
                                    //Log
                                    err("Antiblock.org v3");
                                    //Set data for future uses
                                    data.abo3 = prop;
                                }
                                window[prop] = null;
                            }
                            //BlockAdBlock
                            if (window.Object.keys(method).length === 3) {
                                //Each key should be 10 character long, one of the 3 keys can be "bab"
                                let isBAB = true;
                                //Verify length
                                const keyLen = window.Object.keys(method).join("").length;
                                if (keyLen !== 30 && keyLen !== 23) {
                                    isBAB = false;
                                } else {
                                    for (let prop in method) {
                                        if (prop.length !== 10 && prop !== "bab") {
                                            isBAB = false;
                                            break;
                                        }
                                    }
                                }
                                if (isBAB) {
                                    //Log
                                    err("BlockAdBlock");
                                    //Remove property
                                    window[prop] = null;
                                }
                            }
                        }
                    } catch (err) { }
                }
            }
        });
        //Antiblock.org (all version)
        const reMsgId = /^[a-z0-9]{4,10}$/i;
        const reTag1 = /^(div|span|b|i|font|strong|center)$/i;
        const reTag2 = /^(a|b|i|s|u|q|p|strong|center)$/i;
        const reWords1 = new window.RegExp("ad blocker|ad block|ad-block|adblocker|ad-blocker|adblock|bloqueur|bloqueador|" +
            "Werbeblocker|adblockert|&#1570;&#1583;&#1576;&#1604;&#1608;&#1603; &#1576;&#1604;&#1587;|блокировщиком", "i");
        const reWords2 = new window.RegExp("kapat|disable|désactivez|désactiver|desactivez|desactiver|desative|desactivar|" +
            "desactive|desactiva|deaktiviere|disabilitare|&#945;&#960;&#949;&#957;&#949;&#961;&#947;&#959;&#960;&#959;&#943;" +
            "&#951;&#963;&#951;|&#1079;&#1072;&#1087;&#1088;&#1077;&#1097;&#1072;&#1090;&#1100;|állítsd le|publicités|" +
            "рекламе|verhindert|advert|kapatınız", "i");
        //Antiblock.org (all version)
        const onInsertHandler = (insertedNode) => {
            if (insertedNode.parentNode &&
                insertedNode.id &&
                insertedNode.style &&
                insertedNode.childNodes.length &&
                insertedNode.firstChild &&
                !insertedNode.firstChild.id &&
                !insertedNode.firstChild.className &&
                reMsgId.test(insertedNode.id) &&
                reTag1.test(insertedNode.nodeName) &&
                reTag2.test(insertedNode.firstChild.nodeName)) {
                //Log
                err("Antiblock.org");
                //Stop audio message
                const audio = insertedNode.querySelector("audio[loop]");
                if (audio) {
                    audio.pause();
                    audio.remove();
                } else if ((data.abo2 && insertedNode.id === data.abo2) ||
                    (insertedNode.firstChild.hasChildNodes() &&
                        reWords1.test(insertedNode.firstChild.innerHTML) &&
                        reWords2.test(insertedNode.firstChild.innerHTML))) {
                    //Antiblock.org v2
                    insertedNode.remove();
                } else if ((data.abo3 && insertedNode.id === data.abo3) ||
                    (insertedNode.firstChild.hasChildNodes() &&
                        insertedNode.firstChild.firstChild.nodeName === "IMG" &&
                        insertedNode.firstChild.firstChild.src.startsWith("data:image/png;base64"))) {
                    //Antiblock.org v3
                    window[data.abo3] = null;
                    insertedNode.remove();
                } else if (data.bsa && insertedNode.id === data.bsa) {
                    //BetterStopAdblock
                    window[data.bsa] = null;
                    insertedNode.remove();
                }
            }
        };
        const observer = new window.MutationObserver((mutations) => {
            for (let i = 0; i < mutations.length; i++) {
                if (mutations[i].addedNodes.length) {
                    for (let j = 0; j < mutations[i].addedNodes.length; j++) {
                        onInsertHandler(mutations[i].addedNodes[j]);
                    }
                }
            }
        });
        observer.observe(document, {
            childList: true,
            subtree: true,
        });
    });
};
/**
 * Setup generic Adfly bypasser, must be called on document-start.
 * @function
 */
a.generic.Adfly = () => {
    //Based on AdsBypasser
    //License: https://github.com/adsbypasser/adsbypasser/blob/master/LICENSE
    a.inject(() => {
        const handler = (encodedURL) => {
            if (window.document.body) {
                //This is not an Adfly page
                return;
            }
            //Some checking
            const index = encodedURL.indexOf("!HiTommy");
            if (index > -1) {
                encodedURL = encodedURL.substring(0, index);
            }
            //Decode URL
            let var1 = "", var2 = "";
            for (let i = 0; i < encodedURL.length; ++i) {
                if (i % 2 === 0) {
                    var1 = var1 + encodedURL.charAt(i);
                } else {
                    var2 = encodedURL.charAt(i) + var2;
                }
            }
            let decodedURL = window.atob(var1 + var2).substring(2);
            if (window.location.hash) {
                decodedURL += location.hash;
            }
            //Make sure the URL is not obviously bad
            if (decodedURL.length > 3 && decodedURL.includes(".")) {
                //Stop the window
                window.stop();
                //Redirect
                window.onbeforeunload = null;
                window.location.href = decodedURL;
            }
        };
        //Setup variable hijacker
        try {
            let val;
            //Prevent running multiple times
            let flag = true;
            window.Object.defineProperty(window, "ysmm", {
                configurable: false,
                set(value) {
                    if (flag) {
                        flag = false;
                        try {
                            if (typeof value === "string") {
                                handler(value);
                            }
                        } catch (err) { }
                    }
                    //In case this is not an Adfly page, I want this variable to be functional
                    val = value;
                },
                get() {
                    return val;
                },
            });
        } catch (err) {
            window.console.error("uBlock Protector failed to set up Adfly bypasser!");
        }
    });
};
/**
 * Create a FuckAdBlock constructor and instance which always returns not detected.
 * @function
 * @param {string} constructorName - The name of the constructor. Escape double quotes if needed.
 * @param {string} instanceName - The name of the instance. Escape double quotes if needed.
 */
a.generic.FuckAdBlock = (constructorName, instanceName) => {
    a.inject(`(() => {
        const errMsg = "Uncaught Error: FuckAdBlock uBlock Origin detector is not allowed on this device!";
        const error = window.console.error.bind(window.console);
        const patchedFuckAdBlock = function () {
            //Based on FuckAdBlock
            //License: https://github.com/sitexw/FuckAdBlock/blob/master/LICENSE
            //===Init===
            //On not detected callbacks
            this._callbacks = [];
            //Add on load event
            window.addEventListener("load", () => {
                this.emitEvent();
            });
            //===v3 Methods===
            //Set options, do nothing
            this.setOption = () => {
                return this;
            };
            //Check, call on not detected callbacks
            this.check = () => {
                this.emitEvent();
                return true;
            };
            //Call on not detected callbacks
            this.emitEvent = () => {
                //Call callbacks
                for (let i = 0; i < this._callbacks.length; i++) {
                    this._callbacks[i]();
                }
                return this;
            };
            //Clear events, empty callback array
            this.clearEvent = () => {
                this._callbacks = [];
            };
            //Add event handler
            this.on = (detected, func) => {
                //Log
                error(errMsg);
                if (!detected) {
                    this._callbacks.push(func);
                }
                return this;
            };
            //Add on detected handler, do nothing
            this.onDetected = () => {
                //Log
                error(errMsg);
                return this;
            };
            //Add on not detected handler
            this.onNotDetected = (func) => {
                return this.on(false, func);
            };
            //===v4 Methods===
            this.debug = {};
            //Set debug state, do nothing
            this.debug.set = () => {
                return this;
            };
        };
        //Define properties
        try {
            window.Object.defineProperty(window, "${constructorName}", {
                configurable: false,
                set() { },
                get() {
                    return patchedFuckAdBlock;
                },
            });
            const instance = new patchedFuckAdBlock();
            window.Object.defineProperty(window, "${instanceName}", {
                configurable: false,
                set() { },
                get() {
                    return instance;
                },
            });
        } catch (err) {
            window.console.error("uBlock Protector failed to set up FuckAdBlock defuser!");
        }
    })();`, true);
};
/**
 * Set up ads.js v2 defuser, must be called on document-start.
 * Call when needed, do not apply this to all domains.
 * @function
 */
a.generic.adsjsV2 = () => {
    a.inject(() => {
        "use strict";
        const error = window.console.error.bind(window.console);
        const matcher = /[a-zA-Z0-9]{11,14}/; //From samples I saw, the length is 12 or 13, checking for 11 to 14 to be sure
        const err = new window.TypeError("Failed to execute 'getElementById' on 'Document': 1 argument required, but only 0 present.");
        let original; //document.getElementById
        const newFunc = (...args) => {
            if (args.length) {
                if (matcher.test(String(args[0]))) {
                    let elem = original.apply(window.document, args);
                    if (elem) {
                        return elem;
                    } else {
                        error("Uncaught Error: ads.js v2 uBlock Origin detector is not allowed on this device!");
                        return window.document.createElement("div");
                    }
                } else {
                    return original.apply(window.document, args)
                }
            } else {
                throw err;
            }
        };
        try {
            original = window.document.getElementById;
            window.document.getElementById = newFunc;
        } catch (err) {
            error("uBlock Protector failed to set up ads.js v2 defuser!");
        }
    });
};
