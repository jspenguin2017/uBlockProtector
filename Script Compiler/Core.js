//AdBlock Protector Core Library
"use strict";

//=====Declaration=====
/**
 * Get a description string of this library.
 * @function
 * @returns {string} A description string of this library.
 */
const a = function () {
    return "AdBlock Protector Core Library " + a.VERSION;
};
/**
 * The version of this library.
 * @const {string}
 */
a.VERSION = "0.1";

//=====Configurations=====
/**
 * Load configurations.
 * @function
 */
a.config = function () {
    //TODO: Implement this
};
/**
 * Whether debug strings should be logged.
 * @const {bool}
 */
a.config.debugMode = true;
/**
 * Whether generic protectors should run.
 * This settings can be overwritten by a rule.
 * @var {bool}
 */
a.config.allowGeneric = true;
/**
 * Whether current domain is excluded.
 * How this will be treated depends on the rules.
 * Will be assigned in a.init()
 * @const {bool}
 */
a.config.domExcluded = null;

//=====Mods=====
/**
 * Apply all mods.
 * @function
 */
a.mods = function () {
    //Facebook mods
    if (a.domCmp(["facebook.com"], true)) {
        //Add Jump To Top button
        const addJumpToTop = function () {
            //Stop if the button already exist, this shouldn't be needed, but just to be sure
            if (a.$("#fbtools_jumptotop_btn").length > 0) {
                return;
            }
            //Check if the nav bar is there
            const navBar = a.$("div[role='navigation']");
            if (navBar.length > 0) {
                //Present, insert button
                navBar.append(`<div class="_4kny _2s24" id="fbtools_jumptotop_btn"><div class="_4q39"><a class="_2s25" href="javascript: void(0);">Top</a></div></div>`);
                a.$("#fbtools_jumptotop_btn").click(function () {
                    a.win.scrollTo(a.win.scrollX, 0);
                });
            } else {
                //Wait a little bit for the window to load, for some reason load event isn't working
                a.win.setTimeout(addJumpToTop, 1000);
            }
        }
        //Hide People You May Know
        //Based on Facebook unsponsored by solskido
        //https://greasyfork.org/en/scripts/22210-facebook-unsponsored
        const hidePeopleYouMayKnow = function () {
            //If body is not loaded, we'll wait a bit, for some reason load event isn't working
            if (a.$("body").length === 0) {
                a.win.setTimeout(hidePeopleYouMayKnow, 1000);
                return;
            }
            //Selector constants
            const streamSelector = "div[id^='topnews_main_stream']";
            const feedSelector = "div[id^='hyperfeed_story_id']";
            const badSelectors = ["a[href^='/friends/requests/']"];
            //Mutation handler
            const handler = function () {
                const stream = a.doc.querySelector(streamSelector);
                if (!stream) {
                    return;
                }
                const feed = stream.querySelectorAll(feedSelector);
                if (!feed.length) {
                    return;
                }
                for (let i = 0; i < feed.length; i++) {
                    remove(feed[i]);
                }
            };
            //Feed remover
            const remove = function (feed) {
                if (!feed) {
                    return;
                }
                for (let i = 0; i < badSelectors.length; i++) {
                    if (feed.querySelectorAll(badSelectors[i]).length) {
                        feed.remove();
                    }
                }
            };
            //Set up mutation observer
            const observer = new a.win.MutationObserver(handler);
            observer.observe(a.doc.querySelector("body"), {
                "childList": true,
                "subtree": true
            });
        };
        //Check configurations
        if (a.mods.Facebook_JumpToTop) {
            addJumpToTop();
        }
        if (a.mods.Facebook_HidePeopleYouMayKnow) {
            hidePeopleYouMayKnow();
        }
    }
    //Blogspot mods
    if (a.mods.Blogspot_AutoNCR && a.domInc(["blogspot"], true) && !a.domCmp(["blogspot.com"], true) && a.c.topFrame) {
        //Auto NCR (No Country Redirect)
        const name = a.dom.replace("www.", "").split(".")[0];
        const path = a.win.location.href.split("/").slice(3).join('/');
        a.win.location.href = "http://" + name + ".blogspot.com/ncr/" + path;
    }
};
/**
 * Whether Jump To Top button should be added to Facebook page.
 * @const {bool}
 */
a.mods.Facebook_JumpToTop = true;
/**
 * Whether People You May Know should be hidden from Facebook.
 * @const {bool}
 */
a.mods.Facebook_HidePeopleYouMayKnow = true;
/**
 * Whether blogspot blogs should be automatically redirected to NCR (No Country Redirect) version.
 * Does not work if the blog is not top frame.
 * @const {bool}
 */
a.mods.Blogspot_AutoNCR = true;

//=====Shortcuts and jQuery=====
/**
 * The unsafeWindow.
 * @const {Object}
 */
a.win = unsafeWindow;
/**
 * The document of unsafeWindow.
 * @const {Object}
 */
a.doc = a.win.document;
/**
 * The console of unsafeWindow.
 * @const {Object}
 */
a.out = a.win.console;
/**
 * The domain of current document.
 * @const {string}
 */
a.dom = a.doc.domain;
/**
 * addEventListener of unsafeWindow.
 * @const {Object}
 */
a.on = function (event, func) {
    a.win.addEventListener(event, func);
};
/**
 * jQuery, will be available after a.init() is called.
 * @const {Object}
 */
a.$ = null;

//=====Constants=====
a.c = {};
/**
 * The error message.
 * @const {string}
 */
a.c.errMsg = "Uncaught AdBlock Error: AdBlocker detectors are not allowed on this device! ";
/**
 * The home page of this project.
 * @const {string}
 */
a.c.settingsPage = "https://x01x012013.github.io/AdBlockProtector/settings.html";
/**
 * The home page of this project.
 * @const {string}
 */
a.c.homePage = "https://x01x012013.github.io/AdBlockProtector/";
/**
 * The home page of this project.
 * @const {string}
 */
a.c.supportPage = "https://github.com/X01X012013/AdBlockProtector/issues";
/**
 * A string that will crash any JavaScript by syntax error when added to anywhere of its code.
 * @const {string}
 */
a.c.syntaxBreaker = "])}\"'`])} \n\r \r\n */ ])}";
/**
 * Whether this script is running on the top frame.
 * @const {boolean}
 */
a.c.topFrame = (function () {
    try {
        return a.win.self === a.win.top;
    } catch (err) {
        //a.win.top was not accessible due to security policies (means we are not top frame)
        return false;
    }
})();

//=====Initializer=====
/**
 * Initialize constants, protect functions, and activate mods.
 * @function
 * @param {Array.<string>} excludedDomCmp - The list of domains to exclude, a.domCmp() will be used to process this.
 * @param {Array.<string>} excludedDomInc - The list of domains to exclude, a.domInc() will be used to process this.
 */
a.init = function (excludedDomCmp, excludedDomInc) {
    //Load jQuery
    a.$ = jQueryFactory(a.win, true);
    jQueryColorLoader(a.$);
    //Load configurations
    a.config();
    a.config.domExcluded = a.domCmp(excludedDomCmp, true) || a.domInc(excludedDomInc, true);
    //Set menu commands
    GM_registerMenuCommand("AdBlock Protector Settings Page", function () {
        GM_openInTab(a.c.settingsPage);
    });
    GM_registerMenuCommand("AdBlock Protector Home Page", function () {
        GM_openInTab(a.c.homePage);
    });
    GM_registerMenuCommand("AdBlock Protector Support Page", function () {
        GM_openInTab(a.c.supportPage);
    });
    //Log excluded or protect functions
    if (a.config.domExcluded) {
        a.out.warn("This domain is in excluded list. ");
    } else {
        a.protectFunc();
    }
    //Apply mods
    a.mods();
    //Home page installation test
    if (a.domCmp(["x01x012013.github.io"], true) && a.doc.location.href.includes("x01x012013.github.io/AdBlockProtector")) {
        a.win.AdBlock_Protector_Script = true;
    }
    //Settings page
    if (a.domCmp(["x01x012013.github.io"], true) && a.doc.location.href.includes("x01x012013.github.io/AdBlockProtector/settings.html")) {
        a.win.alert("Coming soon... ");
    }
    //Log domain
    a.out.warn("Domain: " + a.dom);
};

//=====Common Functions=====
/**
 * Write error message to console.
 * @function
 */
a.err = function () {
    a.out.error(a.c.errMsg);
};
/**
 * Check if current domain ends with one of the domains in the list.
 * Example: "google.com" will match "google.com" and domains that ends with ".google.com"
 * @function
 * @param {Array.<string>} domList - The list of domains to compare.
 * @param {boolean} [noErr=false] - Set to true to prevent showing error message.
 * @returns {boolean} True if current domain is in the list, false otherwise.
 */
a.domCmp = function (domList, noErr) {
    //Loop though each element
    for (let i = 0; i < domList.length; i++) {
        //Check if current domain is exactly listed or ends with it
        if (a.dom === domList[i] || a.dom.endsWith("." + domList[i])) {
            if (!noErr) {
                //Show error message when matched
                a.err();
            }
            return true;
        }
    }
    return false;
};
/**
 * Check if current domain includes one of the strings that is in the list.
 * Example: "google" will match domains starting with "google." and domains that includes ".google."
 * @function
 * @param {Array.<string>} domList - The list of strings to compare.
 * @param {boolean} [noErr=false] - Set to true to prevent showing error message.
 * @returns {boolean} True if current domain is in the list, false otherwise.
 */
a.domInc = function (domList, noErr) {
    //Loop though each element
    for (let i = 0; i < domList.length; i++) {
        //Check if current domain is exactly listed or ends with it
        if (a.dom.startsWith(domList[i] + ".") || a.dom.includes("." + domList[i] + ".")) {
            if (!noErr) {
                //Show error message when matched
                a.err();
            }
            return true;
        }
    }
    return false;
};
/**
 * Replace Function.prototype.toString() in order to prevent protected functions from being detected.
 * Do not call this function multiple times.
 * @function
 * @returns {boolean} True if the operation was successful, false otherwise.
 */
a.protectFunc = function () {
    //The original function
    const original = a.win.Function.prototype.toString;
    //New function
    const newFunc = function () {
        //Check if function "this" is in the protected list
        const index = a.protectFunc.pointers.indexOf(this);
        if (index !== -1) {
            //Protected, return the string value of the real function instead
            return a.protectFunc.masks[index];
        } else {
            //Not protected, use original function to proceed
            return original.apply(this);
        }
    };
    //Try to replace the function
    try {
        //Replace function
        a.win.Function.prototype.toString = newFunc;
        //Protect this function as well
        a.protectFunc.pointers.push(newFunc);
        a.protectFunc.masks.push(original.toString());
        //Log when activated
        a.out.warn("Functions protected. ");
    } catch (err) {
        //Failed to hide
        a.out.error("AdBlock Protector failed to protect functions! ");
        return false;
    }
    return true;
};
/**
 * Pointers to protected functions.
 * @const {Array.<Function>}
 */
a.protectFunc.pointers = [];
/**
 * Mask of protected functions.
 * @const {Array.<string>}
 */
a.protectFunc.masks = [];
/**
 * Adds a filter to another function so arguments with forbidden keywords are not allowed.
 * Use RegExp to combine filters, do not activate filter multiple times on the same function.
 * @function
 * @param {string} func - The name of the function to filter, use "." to separate multiple layers, max 2 layers.
 * @param {RegExp} [filter=/[\S\s]/] - Filter to apply, block everything if this argument is missing.
 * @returns {boolean} True if the operation was successful, false otherwise.
 */
a.filter = function (func, filter) {
    //Default parameters
    filter = filter || /[\S\s]/;
    //The original function, will be set later
    let original;
    //The function names array, will be set later if there is more than one layer
    let fNames;
    //The function with filters
    const newFunc = function () {
        //Debug - Log when called
        if (a.config.debugMode) {
            a.out.warn(func + " is called with these arguments: ");
            for (let i = 0; i < arguments.length; i++) {
                a.out.warn(arguments[i].toString());
            }
        }
        //Apply filter
        for (let i = 0; i < arguments.length; i++) {
            if (filter.test(arguments[i].toString())) {
                //Not allowed
                a.err();
                return;
            }
        }
        //Debug - Log when passed
        if (a.config.debugMode) {
            a.out.info("Tests passed. ");
        }
        //Allowed
        if (typeof fNames === "object") {
            //Two layers
            return original.apply(a.win[fNames[0]], arguments);
        } else {
            //One layer
            return original.apply(a.win, arguments);
        }
    };
    //Try to replace the function
    try {
        //Replace function
        if (func.includes(".")) {
            //Two layers
            fNames = func.split(".");
            original = a.win[fNames[0]][fNames[1]];
            a.win[fNames[0]][fNames[1]] = newFunc;
        } else {
            //One layer
            original = a.win[func];
            a.win[func] = newFunc;
        }
        //Add this filter to protection list
        a.protectFunc.pointers.push(newFunc);
        a.protectFunc.masks.push(original.toString());
        //Log when activated
        a.out.warn("Filter activated on " + func);
    } catch (err) {
        //Failed to activate
        a.out.error("AdBlock Protector failed to activate filter on " + func + "! ");
        return false;
    }
    return true;
};
/**
 * Patch the HTML, this must be ran on document-start.
 * @function
 * @param {Function} patcher - A function that patches the HTML, it must return the patched HTML.
 */
a.patchHTML = function (patcher) {
    //Stop the webpage
    a.win.stop();
    //Get content
    GM_xmlhttpRequest({
        method: "GET",
        url: a.doc.location.href,
        headers: {
            "Referer": a.doc.referrer
        },
        onload: function (result) {
            const html = patcher(result.responseText);
            a.doc.write(html);
        }
    })
};
/**
 * Replace a sample of code by syntax breaker.
 * This is the easiest way to break "stand alone" in-line JavaScript.
 * @function
 * @param {string} sample - A sample of code.
 */
a.crashScript = function (sample) {
    a.patchHTML(function (html) {
        return html.replace(sample, a.c.syntaxBreaker);
    })
};
/**
 * Defines a read-only property to unsafeWindow.
 * @function
 * @param {string} name - The name of the property to define, max 2 layers.
 * @param {*} val - The value to set.
 * @returns {boolean} True if the operation was successful, false otherwise.
 */
a.readOnly = function (name, val) {
    //Try to set read only variable
    try {
        if (name.includes(".")) {
            //Two layers
            let nameArray = name.split(".");
            a.win.Object.defineProperty(a.win[nameArray[0]], nameArray[1], {
                configurable: false,
                set: function () { },
                get: function () {
                    return val;
                }
            });
        } else {
            //One layer
            a.win.Object.defineProperty(a.win, name, {
                configurable: false,
                set: function () { },
                get: function () {
                    return val;
                }
            });
        }
    } catch (err) {
        //Failed to define property
        a.out.error("AdBlock Protector failed to define read-only property " + name + "! ");
        return false;
    }
    return true;
};
/**
 * Inject CSS into HTML.
 * @function
 * @param {string} str - The CSS to inject, !important will be added automatically.
 */
a.css = function (str) {
    let temp = str.split(";");
    for (let i = 0; i < temp.length - 1; i++) {
        if (!temp[i].endsWith("!important")) {
            temp[i] += " !important";
        }
    }
    GM_addStyle(temp.join(";"));
};
/**
 * Add a bait element.
 * @function
 * @param {string} type - The type of the element, example: div.
 * @param {string} identifier - The class or id, example: .test (class) #test (id).
 */
a.bait = function (type, identifier) {
    //Create element
    let elem = a.$("<" + type + ">");
    //Add identifier
    if (identifier.startsWith("#")) {
        elem.attr("id", identifier.substr(1));
    } else if (identifier.startsWith(".")) {
        elem.addClass(identifier.substr(1));
    }
    //Add content
    elem.html("<br>");
    //Add to html
    a.$("html").append(elem);
};
/**
 * Set or get a cookie
 * @function
 * @param {string} key - The key of the cookie.
 * @param {string} [val=undefined] - The value to set, omit this to get the cookie.
 * @param {string} [time=31536000000] - In how many milliseconds will it expire, defaults to 1 year.
 * @param {string} [path=undefined] - The path to set, defaults to /.
 * @returns {string} The value of the cookie, null will be returned if the cookie doesn't exist, and undefined will be returned in set mode.
 */
a.cookie = function (key, val, time, path) {
    if (typeof val === "undefined") {
        //Get mode
        const value = "; " + a.doc.cookie;
        let parts = value.split("; " + key + "=");
        if (parts.length == 2) {
            return parts.pop().split(";").shift();
        } else {
            return null;
        }
    } else {
        //Set mode
        let expire = new Date();
        expire.setTime(new Date().getTime() + (time || 31536000000));
        a.doc.cookie = name + "=" + encodeURIComponent(val) + ";expires=" + expire.toGMTString() + ";path=" + (path || "/");
    }
}
/**
 * Generate a native HTML5 player with controls but not autoplay.
 * @function
 * @param {string} source - The source of the video.
 * @param {string} [typeIn=Auto Detect] - The type of the video, will be automatically detected if not supplied.
 * @param {string} [widthIn="100%"] - The width of the player.
 * @param {string} [heightIn="auto"] - The height of the player.
 * @returns {string} An HTML string of the video player.
 */
a.nativePlayer = function (source, typeIn, widthIn, heightIn) {
    //Detect type
    let type;
    if (typeIn) {
        type = typeIn;
    } else {
        const temp = source.split(".");
        switch (temp[temp.length - 1]) {
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
    //Assign width and height
    const width = widthIn || "100%";
    const height = heightIn || "auto";
    //Construct HTML string
    return `<video width='${width}' height='${height}' controls><source src='${source}' type='${type}'></video>`
};
/**
 * Run function that is passed in on document-start, document-idle, and document-end
 * @function
 * @param {Function} func - The function to run.
 */
a.always = function (func) {
    func();
    a.on("DOMContentLoaded", func);
    a.on("load", func);
};

//=====Specialized Functions=====
/**
 * Activate all generic filters.
 * @function
 */
a.generic = function () {
    //Based on generic killers of Anti-Adblock Killer
    if (a.config.allowGeneric && !a.config.domExcluded) {
        const data = {};
        //===document-start===
        //FuckAdBlock
        a.generic.FuckAdBlock("FuckAdBlock", "fuckAdBlock");
        a.generic.FuckAdBlock("BlockAdBlock", "blockAdBlock");
        //ads.js
        a.readOnly("canRunAds", true);
        a.readOnly("canShowAds", true);
        a.readOnly("isAdBlockActive", false);
        //===document-idle===
        a.on("DOMContentLoaded", function () {
            //AdBlock Detector (XenForo Rellect)
            if (a.win.XenForo && typeof a.win.XenForo.rellect == 'object') {
                a.win.XenForo.rellect = {
                    AdBlockDetector: {
                        start: function () { }
                    }
                };
            }
            //Adbuddy
            if (typeof a.win.closeAdbuddy === 'function') {
                a.win.closeAdbuddy();
            }
            //AdBlock Alerter (WP)
            if (a.$("div.adb_overlay > div.adb_modal_img").length > 0) {
                //Remove alert and allow scrolling
                a.$("div.adb_overlay").remove();
                a.css("html,body {height:auto; overflow: auto;}");
            }
            //Block screen
            if (a.$("#blockdiv").html() === "disable ad blocking or use another browser without any adblocker when you visit") {
                a.$("#blockdiv").remove();
            }
            //Antiblock.org v2
            const styles = document.querySelectorAll("style");
            for (let i = 0; i < styles.length; i++) {
                const style = styles[i];
                const cssRules = style.sheet.cssRules;
                for (var j = 0; j < cssRules.length; j++) {
                    const cssRule = cssRules[j];
                    const cssText = cssRule.cssText;
                    const pattern = /^#([a-z0-9]{4,10}) ~ \* \{ display: none; \}/;
                    if (pattern.test(cssText)) {
                        const id = pattern.exec(cssText)[1];
                        if (a.$("script:contains(w.addEventListener('load'," + id + ",false))")) {
                            data.abo2 = id;
                            break;
                        }
                    }
                }
            }
            //Antiblock.org v3, BetterStopAdblock, and BlockAdBlock
            for (let prop in a.win) {
                try {
                    if (!/^webkit/.test(prop) && /^[a-z0-9]{4,12}$/i.test(prop) && prop !== "document" && (a.win[prop] instanceof HTMLDocument) === false && a.win.hasOwnProperty(prop) && typeof a.win[prop] === "object") {
                        const method = win[prop];
                        //Antiblock.org v3 and BetterStopAdblock
                        if (method.deferExecution &&
                            method.displayMessage &&
                            method.getElementBy &&
                            method.getStyle &&
                            method.insert &&
                            method.nextFunction) {
                            if (method.toggle) {
                                data.bsa = prop;
                            } else {
                                data.abo3 = prop;
                            }
                            a.win[prop] = null; //Remove instance
                        }
                        //BlockAdBlock
                        if (method.bab) { //Variant 1
                            win[prop] = null;
                        } else if (Object.keys(method).length === 3 && Object.keys(method).map(function (value, index) {
                            return value;
                        }).join().length === 32) { //Variant 2
                            win[prop] = null;
                        }
                    }
                } catch (err) { }
            }
        });
        //===on-insert===
        const onInsertHandler = function (insertedNode) {
            //No-Adblock
            if (insertedNode.id &&
                insertedNode.id.length === 4 &&
                /^[a-z0-9]{4}$/.test(insertedNode.id) &&
                insertedNode.nodeName === "DIV" &&
                insertedNode.firstChild &&
                insertedNode.firstChild.id &&
                insertedNode.firstChild.id === insertedNode.id &&
                insertedNode.innerHTML.includes("no-adblock.com")) {
                //Remove
                insertedNode.remove();
            }
            //StopAdblock
            if (insertedNode.id &&
                insertedNode.id.length === 7 &&
                /^a[a-z0-9]{6}$/.test(insertedNode.id) &&
                insertedNode.nodeName === "DIV" &&
                insertedNode.parentNode &&
                insertedNode.parentNode.id &&
                insertedNode.parentNode.id === insertedNode.id + "2" &&
                insertedNode.innerHTML.includes("stopadblock.org")) {
                //Remove
                insertedNode.remove();
            }
            //AntiAdblock (Packer)
            const reIframeId = /^(zd|wd)$/;
            const reImgId = /^(xd|gd)$/;
            const reImgSrc = /\/ads\/banner.jpg/;
            const reIframeSrc = /(\/adhandler\/|\/adimages\/|ad.html)/;
            if (insertedNode.id &&
                reImgId.test(insertedNode.id) &&
                insertedNode.nodeName === "IMG" &&
                reImgSrc.test(insertedNode.src) ||
                insertedNode.id &&
                reIframeId.test(insertedNode.id) &&
                insertedNode.nodeName === "IFRAME" &&
                reIframeSrc.test(insertedNode.src)) {
                insertedNode.remove();
            }
            //Adunblock
            const reId = /^[a-z]{8}$/;
            const reClass = /^[a-z]{8} [a-z]{8}/;
            const reBg = /^[a-z]{8}-bg$/;
            const reMessage = /Il semblerait que vous utilisiez un bloqueur de publicité !/;
            if (typeof a.win.vtfab !== "undefined" &&
                typeof Aak.uw.adblock_antib !== "undefined" &&
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
                    //Full Screen Message (Premium)
                    insertedNode.nextSibling.remove(); //Overlay
                    insertedNode.remove(); //Box
                } else if (insertedNode.nextSibling.id &&
                           reId.test(insertedNode.nextSibling.id) &&
                           reMessage.test(insertedNode.innerHTML)) {
                    //Top bar Message (Free)
                    insertedNode.remove();
                }
            }
            //Antiblock
            const reMsgId = /^[a-z0-9]{4,10}$/i;
            const reTag1 = /^(div|span|b|i|font|strong|center)$/i;
            const reTag2 = /^(a|b|i|s|u|q|p|strong|center)$/i;
            const reWords1 = /ad blocker|ad block|ad-block|adblocker|ad-blocker|adblock|bloqueur|bloqueador|Werbeblocker|adblockert|&#1570;&#1583;&#1576;&#1604;&#1608;&#1603; &#1576;&#1604;&#1587;|блокировщиком/i;
            const reWords2 = /kapat|disable|désactivez|désactiver|desactivez|desactiver|desative|desactivar|desactive|desactiva|deaktiviere|disabilitare|&#945;&#960;&#949;&#957;&#949;&#961;&#947;&#959;&#960;&#959;&#943;&#951;&#963;&#951;|&#1079;&#1072;&#1087;&#1088;&#1077;&#1097;&#1072;&#1090;&#1100;|állítsd le|publicités|рекламе|verhindert|advert|kapatınız/i;
            //Antiblock.org (all version)
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
                //Stop audio message
                const audio = insertedNode.querySelector("audio[loop]");
                if (audio) {
                    audio.pause();
                    audio.remove();
                } else if ((data.abo2 && insertedNode.id === data.abo2) ||
                         (insertedNode.firstChild.hasChildNodes() && reWords1.test(insertedNode.firstChild.innerHTML) && reWords2.test(insertedNode.firstChild.innerHTML))) {
                    //Antiblock.org v2
                    insertedNode.remove();
                } else if ((data.abo3 && insertedNode.id === data.abo3) ||
                         (insertedNode.firstChild.hasChildNodes() && insertedNode.firstChild.firstChild.nodeName === "IMG" && /^data:image\/png;base64/.test(insertedNode.firstChild.firstChild.src))) {
                    //Antiblock.org v3
                    a.win[data.abo3] = null;
                    insertedNode.remove();
                } else if (data.bsa && insertedNode.id === data.bsa) {
                    //BetterStopAdblock
                    a.win[data.bsa] = null;
                    insertedNode.remove();
                }
            }
        };
        //Set up observer
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.addedNodes.length) {
                    Array.prototype.forEach.call(mutation.addedNodes, function (addedNode) {
                        onInsertHandler(addedNode);
                    });
                }
            });
        });
        observer.observe(a.doc, {
            childList: true,
            subtree: true
        });
    } else {
        //Generic protectors disabled
        a.out.warn("Generic protectors are disabled on this domain. ");
    }
};
/**
 * Create a FuckAdBlock constructor and instance which always returns not detected.
 * @function
 * @param {string} constructorName - The name of the constructor.
 * @param {string} instanceName - The name of the instance.
 * @returns {boolean} True if the operation was successful, false otherwise.
 */
a.generic.FuckAdBlock = function (constructorName, instanceName) {
    const patchedFuckAdBlock = function () {
        //Based on FuckAdBlock by sitexw
        //https://github.com/sitexw/FuckAdBlock
        //===Init===
        //On not detected callbacks
        this._callbacks = [];
        //Add on load event
        a.on("load", (function () {
            this.emitEvent();
        }).bind(this));
        //===v3 Methods===
        //Set options, do nothing
        this.setOption = function () {
            return this;
        };
        //Check, call on not detected callbacks
        this.check = function () {
            this.emitEvent();
            return true;
        };
        //Call on not detected callbacks
        this.emitEvent = function () {
            for (let i = 0; i < this._callbacks.length; i++) {
                this._callbacks[i]();
            }
            return this;
        };
        //Clear events, empty callback array
        this.clearEvent = function () {
            this._callbacks = [];
        };
        //Add event handler
        this.on = function (detected, func) {
            if (!detected) {
                this._callbacks.push(func);
            }
            return this;
        };
        //Add on detected handler, do nothing
        this.onDetected = function () {
            return this;
        };
        //Add on not detected handler
        this.onNotDetected = function (func) {
            return this.on(false, func);
        };
        //===v4 Methods===
        this.debug = {};
        this.debug.set = (function () {
            return this;
        }).bind(this);
    };
    //Define FuckAdBlock to unsafeWindow and create its instance, error checks are done in a.readOnly()
    return a.readOnly(constructorName, patchedFuckAdBlock) && a.readOnly(instanceName, new a.win[constructorName]);
};
