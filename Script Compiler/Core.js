//uBlock Protector Core Library
"use strict";

//=====Initializer=====
/**
 * Initialization.
 * @function
 * @param {boolean} excluded - Whether this domain should be excluded from generic solutions.
 * @param {boolean} AdflyMatch - Whether this domain is an Adfly domain.
 * @param {boolean} AdflyUnmatch - Whether this domain should be excluded from Adfly skipper.
 */
a.init = (excluded, AdflyMatch, AdflyUnmatch) => {
    //Load a new jQuery into a.$
    a.$ = a.make$();
    //Load configurations
    a.config();
    //Log domain
    a.config.debugMode && a.out.warn("Domain: " + a.dom);
    //Check excluded domains
    a.config.domExcluded = excluded;
    if (a.config.debugMode && excluded) {
        a.out.warn("This domain is in excluded list. ");
    }
    //Check Adfly
    if (!excluded && (AdflyMatch || (a.config.aggressiveAdflySkiper && !AdflyUnmatch))) {
        a.generic.AdflySkipper();
    }
    //Apply mods
    a.mods();
    //Set menu commands
    GM_registerMenuCommand("uBlock Protector Settings Page", () => {
        GM_openInTab(a.c.settingsPage);
    });
    GM_registerMenuCommand("uBlock Protector Home Page", () => {
        GM_openInTab(a.c.homePage);
    });
    GM_registerMenuCommand("uBlock Protector Support Page", () => {
        GM_openInTab(a.c.supportPage);
    });
    //Home page installation test
    if (a.domCmp(["jspenguin2017.github.io"], true) && a.doc.location.href.includes("jspenguin2017.github.io/uBlockProtector")) {
        a.win.uBlock_Protector_Script = true;
    }
    //Settings page
    if (a.domCmp(["jspenguin2017.github.io"], true) && a.doc.location.href.includes("jspenguin2017.github.io/uBlockProtector/settings.html")) {
        a.on("load", () => {
            a.win.init({
                "config_debugMode": a.config.debugMode,
                "config_allowExperimental": a.config.allowExperimental,
                "config_aggressiveAdflySkiper": a.config.aggressiveAdflySkiper,
                "mods_Facebook_JumpToTop": a.mods.Facebook_JumpToTop,
                "mods_Blogspot_AutoNCR": a.mods.Blogspot_AutoNCR,
                "mods_NoAutoplay": a.mods.NoAutoplay,
            }, a.config.update);
        });
    }
};

//=====Configurations=====
/**
 * Load configurations, includes mods configurations.
 * @function
 */
a.config = () => {
    //Configuration
    a.config.debugMode = GM_getValue("config_debugMode", a.config.debugMode);
    a.config.allowExperimental = GM_getValue("config_allowExperimental", a.config.allowExperimental);
    a.config.aggressiveAdflySkiper = GM_getValue("config_aggressiveAdflySkiper", a.config.aggressiveAdflySkiper);
    //Mods
    a.mods.Facebook_JumpToTop = GM_getValue("mods_Facebook_JumpToTop", a.mods.Facebook_JumpToTop);
    a.mods.Blogspot_AutoNCR = GM_getValue("mods_Blogspot_AutoNCR", a.mods.Blogspot_AutoNCR);
    a.mods.NoAutoplay = GM_getValue("mods_NoAutoplay", a.mods.NoAutoplay);
};
/**
 * Update a configuration.
 * @function
 * @param {integer} id - The ID of the configuration.
 * @param {bool} val - The value of the configuration.
 */
a.config.update = (id, val) => {
    const names = [
        "config_debugMode",
        "config_allowExperimental",
        "config_aggressiveAdflySkiper",
        "mods_Facebook_JumpToTop",
        "mods_Blogspot_AutoNCR",
        "mods_NoAutoplay",
    ];
    //Sanity check then save settings
    if (names.includes(id)) {
        GM_setValue(id, Boolean(val));
    }
};
/**
 * Whether debug data should be logged.
 * The default value is false.
 * @const {bool}
 */
a.config.debugMode = false;
/**
 * Whether generic solutions should be applied.
 * This settings is currently not exposed to the user.
 * This settings can be overwritten by a rule.
 * @var {bool}
 */
a.config.allowGeneric = true;
/**
 * Whether experimental features should run.
 * The default value is true.
 * @const {bool}
 */
a.config.allowExperimental = true;
/**
 * Whether Adfly skipper should run on all pages.
 * The handler will check to make sure the page is an Adfly page.
 * The default value is true.
 * @const {bool}
 */
a.config.aggressiveAdflySkiper = true;
/**
 * Whether current domain is "excluded".
 * How this will be treated depends on the rules.
 * Generic solutions will not apply if this is true.
 * Will be assigned by a.init().
 * @const {bool}
 */
a.config.domExcluded = null;

//=====Miscellaneous=====
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
 * jQuery, will be available after a.init() is called.
 * @const {Object}
 */
a.$ = null;
/**
 * The real addEventListener.
 * @const {Function}
 */
a.on = a.win.addEventListener.bind(a.win);
/**
 * The real setTimeout.
 * @const {Function}
 */
a.setTimeout = a.win.setTimeout.bind(a.win);
/**
 * The real clearTimeout.
 * @const {Function}
 */
a.clearTimeout = a.win.clearTimeout.bind(a.win);
/**
 * The real setInterval.
 * @const {Function}
 */
a.setInterval = a.win.setInterval.bind(a.win);
/**
 * The real clearInterval.
 * @const {Function}
 */
a.clearInterval = a.win.clearInterval.bind(a.win);
/**
 * Matching methods.
 * @const {Enumeration}
 */
a.matchMethod = {
    matchAll: 0, //Match all, omit defaults to this
    string: 1, //Partial string match
    stringExact: 2, //Exact string match, will result in match if one or more arguments matches the filter
    RegExp: 3, //Regular expression
    callback: 4, //Callback, arguments list will be supplied as an array, return true for match and false for not match
};
/**
 * Apply matching.
 * @function
 * @param {Array} args - Elements to match.
 * @param {Enumeration} method - The method to use.
 * @param {Any} filter - The appropriate filter.
 * @return {boolean} True if there is a match, false otherwise.
 */
a.applyMatch = (args, method, filter) => {
    switch (method) {
        case a.matchMethod.string:
            for (let i = 0; i < args.length; i++) {
                if (String(args[i]).includes(filter)) {
                    return true;
                }
            }
            break;
        case a.matchMethod.stringExact:
            for (let i = 0; i < args.length; i++) {
                if (filter === String(args[i])) {
                    return true;
                }
            }
            break;
        case a.matchMethod.RegExp:
            for (let i = 0; i < args.length; i++) {
                if (filter.test(String(args[i]))) {
                    return true;
                }
            }
            break;
        case a.matchMethod.callback:
            return filter(args);
        default:
            //Match all
            return true;
    }
    //Not matched
    return false;
};

//=====Constants=====
/**
 * Object containing all constants.
 * @const {Object}
 */
a.c = {};
/**
 * The settings page of this project.
 * @const {string}
 */
a.c.settingsPage = "https://jspenguin2017.github.io/uBlockProtector/settings.html";
/**
 * The home page of this project.
 * @const {string}
 */
a.c.homePage = "https://jspenguin2017.github.io/uBlockProtector/";
/**
 * The support (issues) page of this project.
 * @const {string}
 */
a.c.supportPage = "https://github.com/jspenguin2017/uBlockProtector/issues";
/**
 * A string that will crash any JavaScript by syntax error when added to anywhere of its code.
 * @const {string}
 */
a.c.syntaxBreaker = "])} \"'` ])} \n\r \r\n */ ])}";
/**
 * Whether this script is running on the top frame.
 * @const {boolean}
 */
a.c.topFrame = (() => {
    try {
        return a.win.self === a.win.top;
    } catch (err) {
        //a.win.top was not accessible due to security reasons (means we are not top frame)
        return false;
    }
})();

//=====Mods=====
/**
 * Apply all mods.
 * @function
 */
a.mods = () => {
    //===Facebook mods===
    if (a.c.topFrame && a.domCmp(["facebook.com"], true)) {
        (function addJumpToTop() {
            //Jump To Top button
            if (a.mods.Facebook_JumpToTop) {
                //Stop if the button already exist, this should not be needed, but just to be sure
                if (a.$("#uBlock_Protector_FBMod_JumpToTop").length > 0) {
                    return;
                }
                //Check if the nav bar is there
                const navBar = a.$("div[role='navigation']");
                if (navBar.length > 0) {
                    //Present, insert button
                    navBar.first().append(`<div class="_4kny _2s24" id="uBlock_Protector_FBMod_JumpToTop"><div class="_4q39"><a class="_2s25" href="javascript: void(0);">Top</a></div></div>`);
                    a.$("#uBlock_Protector_FBMod_JumpToTop").click(() => {
                        a.win.scrollTo(a.win.scrollX, 0);
                    });
                    a.config.debugMode && a.out.info("Facebook Mod: Jump to Top button added. ");
                } else {
                    //Wait a little bit for the window to load, for some reason load event is not working
                    a.setTimeout(addJumpToTop, 500);
                }
            }
        })();
    }
    //===Blogspot mods===
    if (a.c.topFrame && a.mods.Blogspot_AutoNCR && a.domInc(["blogspot"], true) && !a.domCmp(["blogspot.com"], true)) {
        //Auto NCR (No Country Redirect) redirect
        const name = a.dom.replace("www.", "").split(".")[0];
        const path = a.win.location.href.split("/").slice(3).join("/");
        a.config.debugMode && a.out.info("Blogspot Mod: Redirecting to NCR... ");
        a.win.location.href = "http://" + name + ".blogspot.com/ncr/" + path;
    }
    //===No autoplay mods===
    if (a.mods.NoAutoplay) {
        if (a.domCmp(["x-link.pl"], true)) {
            //iframe of gs24.pl
            a.observe("insert", (node) => {
                if (node.tagName === "VIDEO") {
                    node.onplay = (() => {
                        //We need to pause twice
                        let playCount = 2;
                        return function () {
                            playCount--;
                            this.pause();
                            if (playCount === 0) {
                                //Paused twice, detach event handler
                                this.onplay = null;
                            }
                        };
                    })();
                }
            });
            a.config.debugMode && a.out.info("No Autoplay Mod: Autoplay disabled. ");
        }
        if (a.domCmp(["komputerswiat.pl"], true)) {
            let token = a.setInterval(() => {
                if (a.$("video").length > 0) {
                    //Get element
                    const player = a.$("video").first();
                    //Block play
                    player[0].onplay = function () {
                        this.pause();
                    };
                    //Replace player
                    player.parents().eq(5).after(a.nativePlayer(player.attr("src"))).remove();
                    a.clearInterval(token);
                }
            }, 1000);
            a.config.debugMode && a.out.info("No Autoplay Mod: Autoplay disabled. ");
        }
        if (a.domCmp(["onet.tv"], true)) {
            //iframe of onet.pl
            a.observe("insert", (node) => {
                if (node && node.firstChild && node.firstChild.tagName === "VIDEO") {
                    //The inserted node is a div with video inside
                    node.firstChild.onplay = function () {
                        this.pause();
                        this.onplay = null;
                    };
                }
            });
        }
    }
};
/**
 * Whether a Jump To Top button should be added to Facebook.
 * The default value is true.
 * @const {bool}
 */
a.mods.Facebook_JumpToTop = true;
/**
 * Whether blogspot blogs should be automatically redirected to NCR (No Country Redirect) version.
 * Does not work if the blog is not top frame.
 * The default value is false.
 * @const {bool}
 */
a.mods.Blogspot_AutoNCR = false;
/**
 * Whether autoplay should be disabled on supported websites.
 * The default value is false.
 * @const {bool}
 */
a.mods.NoAutoplay = false;

//=====Common Functions=====
/**
 * Returns a new jQuery.
 * @function
 */
a.make$ = () => {
    //Load jQuery
    let $ = a.jQueryFactory(a.win, true);
    //Load color plug-in
    //The color plug-in is not enabled, to enable it, update the compiler and uncomment the following line
    //a.jQueryColorLoader($);
    return $;
};
/**
 * Write an error message to console.
 * @function
 * @param {string} [name=""] - The name of the AdBlocker detector.
 */
a.err = (name) => {
    //Check argument
    if (name) {
        name = name + " ";
    } else {
        name = "";
    }
    //Write error message
    a.out.error(`Uncaught AdBlock Error: ${name}AdBlocker detectors are not allowed on this device! `);
};
/**
 * Check if current domain ends with one of the domains in the list.
 * Example: "google.com" will match "google.com" and domains ending with ".google.com"
 * @function
 * @param {Array.<string>} domList - The list of domains to compare.
 * @param {boolean} [noErr=false] - Set to true to prevent showing error message.
 * @return {boolean} True if current domain is in the list, false otherwise.
 */
a.domCmp = (domList, noErr) => {
    //Loop though each element
    for (let i = 0; i < domList.length; i++) {
        //Check if current domain is exactly listed or ends with it
        if (a.dom === domList[i] || a.dom.endsWith("." + domList[i])) {
            if (a.config.debugMode && !noErr) {
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
 * Example: "google" will match domains starting with "google." and domains that include ".google."
 * @function
 * @param {Array.<string>} domList - The list of strings to compare.
 * @param {boolean} [noErr=false] - Set to true to prevent showing error message.
 * @return {boolean} True if current domain is in the list, false otherwise.
 */
a.domInc = (domList, noErr) => {
    //Loop though each element
    for (let i = 0; i < domList.length; i++) {
        //Check if current domain is exactly listed or ends with it
        if (a.dom.startsWith(domList[i] + ".") || a.dom.includes("." + domList[i] + ".")) {
            if (a.config.debugMode && !noErr) {
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
 * This function should be called from rules once if needed.
 * @function
 * @return {boolean} True if the operation was successful, false otherwise.
 */
a.protectFunc = () => {
    //Update flag
    a.protectFunc.enabled = true;
    //The original function
    const original = a.win.Function.prototype.toString;
    //New function
    const newFunc = function () {
        //Check if function "this" is in the protected list
        const index = a.protectFunc.pointers.indexOf(this);
        if (index === -1) {
            //Not protected, use original function to proceed
            return original.apply(this);
        } else {
            //Protected, return the mask string
            return a.protectFunc.masks[index];
        }
    };
    //Try to replace toString()
    try {
        a.win.Function.prototype.toString = newFunc;
        //Protect this function as well
        a.protectFunc.pointers.push(newFunc);
        a.protectFunc.masks.push(String(original));
        //Activate log
        a.config.debugMode && a.out.warn("Functions protected. ");
    } catch (err) {
        //Failed to protect
        a.config.debugMode && a.out.error("uBlock Protector failed to protect functions! ");
        return false;
    }
    return true;
};
/**
 * Whether protect functions is enabled.
 * @var {bool}
 */
a.protectFunc.enabled = false;
/**
 * Pointers to protected functions.
 * @var {Array.<Function>}
 */
a.protectFunc.pointers = [];
/**
 * Mask of protected functions.
 * @var {Array.<string>}
 */
a.protectFunc.masks = [];
/**
 * Filter a function.
 * @function
 * @param {string} func - The name of the function to filter, use "." to separate multiple layers.
 * @param {Enumeration} [method=Match All] - An option from a.matchMethods, omit or pass null defaults to match all.
 * @param {Any} filter - Filter to apply, this must be appropriate for the method.
 * @param {Function} [onMatch=undefined] - Callback when filter is matched, arguments list (as an array) will be supplied, return value of this callback will be send back to caller.
 * @param {Function} [onAfter=undefined] - Callback when filter is applied, match state (true for blocked, false for allowed) and arguments list (as an array) will be supplied.
 * @return {boolean} True if the operation was successful, false otherwise.
 */
a.filter = (func, method, filter, onMatch, onAfter) => {
    //The original function and its parent, will be set later
    let original = a.win;
    let parent;
    //The replacement function with filters
    const newFunc = (...args) => {
        //Call log
        if (a.config.debugMode) {
            a.out.warn(func + " is called with these arguments: ");
            for (let i = 0; i < args.length; i++) {
                a.out.warn(String(args[i]));
            }
        }
        //Apply filter
        if (!method || a.applyMatch(args, method, filter)) {
            //Not allowed
            a.config.debugMode && a.err();
            let ret = undefined;
            if (onMatch) {
                ret = onMatch(args);
            }
            onAfter && onAfter(true, args);
            return ret;
        }
        //Tests passed log
        a.config.debugMode && a.out.info("Tests passed. ");
        //Allowed
        onAfter && onAfter(false, args);
        return original.apply(parent, args);
    };
    //Try to replace the function
    try {
        //Get original and its parent
        let stack = func.split(".");
        let current;
        while (current = stack.shift()) {
            parent = original;
            original = parent[current];
            //Patch if stack is empty
            if (!stack.length) {
                parent[current] = newFunc;
            }
        }
        //Add this filter to protection list
        if (a.protectFunc.enabled) {
            a.protectFunc.pointers.push(newFunc);
            a.protectFunc.masks.push(String(original));
        }
        //Activate log
        a.config.debugMode && a.out.warn("Filter activated on " + func);
    } catch (err) {
        //Failed to activate
        a.config.debugMode && a.out.error("uBlock Protector failed to activate filter on " + func + "! ");
        return false;
    }
    return true;
};
/**
 * Change the execution delay for setTimeout or setInterval.
 * @function
 * @param {string} func - The name of the function to patch, can be "setTimeout" or "setInterval".
 * @param {Enumeration} [method=Match All] - An option from a.matchMethods, omit or pass null defaults to match all.
 * @param {Any} filter - Filter to apply, this must be appropriate for the method.
 * @param {Function} [onMatch=undefined] - Callback when filter is matched, arguments list (as an array) will be supplied.
 * @param {Function} [onAfter=undefined] - Callback when filter is applied, match state (true for blocked, false for allowed) and arguments list (as an array) will be supplied.
 * @param {float} [ratio=0.02] - The boost ratio, between 0 and 1 for speed up, larger than 1 for slow down, defaults to speed up 50 times.
 * @return {boolean} True if the operation was successful, false otherwise.
 */
a.timewarp = (func, method, filter, onMatch, onAfter, ratio = 0.02) => {
    //The original function
    const original = a.win[func];
    //The replacement function with timewarp
    const newFunc = (...args) => {
        //Call log
        if (a.config.debugMode) {
            a.out.warn("Timewarpped " + func + " is called with these arguments: ");
            for (let i = 0; i < args.length; i++) {
                a.out.warn(String(args[i]));
            }
        }
        //Check if we need to timewarp this function
        if (!method || a.applyMatch(args, method, filter)) {
            //Timewarp
            a.config.debugMode && a.out.warn("Timewarpped. ");
            onMatch && onMatch(args);
            onAfter && onAfter(true, args);
            args[1] *= ratio;
            return original.apply(a.win, args);
        } else {
            //Do not timewarp
            a.config.debugMode && a.out.info("Not timewarpped. ");
            onAfter && onAfter(false, args);
            return original.apply(a.win, args);
        }
    };
    //Try to replace the function
    try {
        a.win[func] = newFunc;
        //Add this filter to protection list
        if (a.protectFunc.enabled) {
            a.protectFunc.pointers.push(newFunc);
            a.protectFunc.masks.push(String(original));
        }
        //Activate log
        a.config.debugMode && a.out.warn("Timewarp activated on " + func);
    } catch (err) {
        //Failed to activate
        a.config.debugMode && a.out.error("uBlock Protector failed to apply timewarp on " + func + "! ");
        return false;
    }
    return true;
};
/**
 * Patch the HTML, this must be ran on document-start.
 * Warning: This breaks uBlock Origin element picker.
 * @function
 * @param {Function} patcher - A function that patches the HTML, it must return the patched HTML.
 */
a.patchHTML = (patcher) => {
    //Stop loading
    a.win.stop();
    //Get content
    GM_xmlhttpRequest({
        method: "GET",
        url: a.doc.location.href,
        headers: {
            "Referer": a.doc.referrer
        },
        onload(result) {
            //Apply patched content
            a.doc.write(patcher(result.responseText));
        },
    });
};
/**
 * Replace a sample of code by syntax breaker.
 * Warning: This breaks uBlock Origin element picker.
 * This is the easiest way to break "stand alone" in-line JavaScript.
 * Can only crash one in-line block.
 * @function
 * @param {string} sample - A sample of code.
 */
a.crashScript = (sample) => {
    a.patchHTML((html) => {
        return html.replace(sample, a.c.syntaxBreaker);
    });
};
/**
 * Defines a read-only property to unsafeWindow.
 * May not be able to lock the property's own properties.
 * @function
 * @param {string} name - The name of the property to define, use "." to separate multiple layers.
 * @param {Any} val - The value to set.
 * @return {boolean} True if the operation was successful, false otherwise.
 */
a.readOnly = (name, val) => {
    try {
        //Find the property and its parent
        let property = a.win;
        let parent;
        let stack = name.split(".");
        let current;
        while (current = stack.shift()) {
            parent = property;
            property = parent[current];
            //Define the property if stack is empty
            if (!stack.length) {
                a.win.Object.defineProperty(parent, current, {
                    configurable: false,
                    set() { },
                    get() {
                        return val;
                    },
                });
            }
        }
    } catch (err) {
        //Failed to define property
        a.config.debugMode && a.out.error("uBlock Protector failed to define read-only property " + name + "! ");
        return false;
    }
    return true;
};
/**
 * Defines a property to unsafeWindow that (tries to) crash scripts who access it.
 * @function
 * @param {string} name - The name of the property to define, use "." to separate multiple layers.
 * @return {boolean} True if the operation was successful, false otherwise.
 */
a.noAccess = (name) => {
    const errMsg = "AdBlock Error: This property may not be accessed! ";
    try {
        //Find the property and its parent
        let property = a.win;
        let parent;
        let stack = name.split(".");
        let current;
        while (current = stack.shift()) {
            parent = property;
            property = parent[current];
            //Define the property if stack is empty
            if (!stack.length) {
                a.win.Object.defineProperty(parent, current, {
                    configurable: false,
                    set() {
                        throw errMsg;
                    },
                    get() {
                        throw errMsg;
                    },
                });
            }
        }
    } catch (err) {
        //Failed to define property
        a.config.debugMode && a.out.error("uBlock Protector failed to define non-accessible property " + name + "! ");
        return false;
    }
    return true;
};
/**
 * Inject CSS into HTML, !important will be added automatically.
 * @function
 * @param {string} str - The CSS to inject.
 */
a.css = (str) => {
    //Add !important
    let temp = str.split(";");
    for (let i = 0; i < temp.length - 1; i++) {
        if (!temp[i].endsWith("!important")) {
            temp[i] += " !important";
        }
    }
    //Inject CSS
    GM_addStyle(temp.join(";"));
};
/**
 * Add a bait element, this sometimes has a side effect that adds an empty bar on top of the page.
 * Sometimes the height of the bait element is checked, so we cannot make it 0 height.
 * @function
 * @param {string} type - The type of the element, example: div.
 * @param {string} identifier - The class or id, example: .test (class) #test (id).
 */
a.bait = (type, identifier) => {
    //Create element
    let elem = a.$(`<${type}>`);
    //Add identifier
    if (identifier.startsWith("#")) {
        elem.attr("id", identifier.substr(1));
    } else if (identifier.startsWith(".")) {
        elem.addClass(identifier.substr(1));
    }
    //Add content and prepend to HTML
    elem.html("<br>").prependTo("html");
};
/**
 * Set or get a cookie.
 * @function
 * @param {string} key - The key of the cookie.
 * @param {string} [val=undefined] - The value to set, omit this to get the cookie.
 * @param {integer} [time=31536000000] - In how many milliseconds will it expire, defaults to 1 year.
 * @param {string} [path="/"] - The path to set.
 * @return {string} The value of the cookie, null will be returned if the cookie does not exist, and undefined will be returned in set mode.
 */
a.cookie = (key, val, time = 31536000000, path = "/") => {
    if (typeof val === "undefined") {
        //Get mode
        //http://stackoverflow.com/questions/10730362/get-cookie-by-name
        const value = "; " + a.doc.cookie;
        let parts = value.split("; " + key + "=");
        if (parts.length == 2) {
            return parts.pop().split(";").shift();
        } else {
            return null;
        }
    } else {
        //Set mode
        let expire = new a.win.Date();
        expire.setTime((new a.win.Date()).getTime() + time);
        a.doc.cookie = key + "=" + a.win.encodeURIComponent(val) + ";expires=" + expire.toGMTString() + ";path=" + path;
    }
};
/**
 * Serialize an object into GET request parameters.
 * http://stackoverflow.com/questions/6566456/how-to-serialize-an-object-into-a-list-of-parameters
 * @function
 * @param {Object} obj - The object to serialize.
 * @return {string} The serialized string.
 */
a.serialize = (obj) => {
    var str = "";
    for (var key in obj) {
        if (str !== "") {
            str += "&";
        }
        str += key + "=" + a.win.encodeURIComponent(obj[key]);
    }
    return str;
};
/**
 * Generate a native HTML5 player with controls but not autoplay.
 * @function
 * @param {string} source - The source of the video.
 * @param {string} [typeIn=(Auto Detect)] - The type of the video, will be automatically detected if not supplied, and defaults to MP4 if detection failed.
 * @param {string} [width="100%"] - The width of the player.
 * @param {string} [height="auto"] - The height of the player.
 * @return {string} An HTML string of the video player.
 */
a.nativePlayer = (source, typeIn, width = "100%", height = "auto") => {
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
    //Construct HTML string
    return `<video width='${width}' height='${height}' controls><source src='${source}' type='${type}'></video>`;
};
/**
 * Generate a videoJS 5.4.6 player with controls but not autoplay.
 * Do not forget to call a.videoJS.init()
 * Parameters sources and types must be parallel arrays. Unlike native player, all parameters must be supplied.
 * @function
 * @param {Array.<string>} sources - The sources of the video.
 * @param {Array.<string>} types - The types of the video.
 * @param {string} width - The width of the player.
 * @param {string} height - The height of the player.
 * @return {string} An HTML string of the video player.
 */
a.videoJS = (sources, types, width, height) => {
    //Build HTML string
    let html = `<video id="uBlock_Protector_Video_Player" class="video-js vjs-default-skin" controls preload="auto" width="${width}" height="${height}" data-setup="{}">`;
    for (let i = 0; i < sources.length; i++) {
        html += `<source src="${sources[i]}" type="${types[i]}">`;
    }
    html += `</video>`;
    return html;
};
/**
 * Initialize videoJS 5.4.6.
 * Do not call this function multiple times.
 * @param {string} [plugins=""] - Plug-ins to load, pass multiple arguments to load more than 1 plug-in. Omit if no plug-in is needed.
 * @function
 */
a.videoJS.init = (...args) => {
    //Disable telemetry
    try {
        a.win.HELP_IMPROVE_VIDEOJS = false;
    } catch (err) { }
    let plugins = args.join();
    //Load components
    a.$("head").append(`<link href="//vjs.zencdn.net/5.4.6/video-js.min.css" rel="stylesheet"><script src="//vjs.zencdn.net/5.4.6/video.min.js"><\/script>${plugins}`);
};
/**
 * Object containing all available VideoJS plug-ins.
 * @const {Object}
 */
a.videoJS.plugins = {};
/**
 * VideoJS plug-in, HLS parser.
 * @const {string}
 */
a.videoJS.plugins.hls = `<script src="//cdnjs.cloudflare.com/ajax/libs/videojs-contrib-hls/5.4.0/videojs-contrib-hls.min.js"><\/script>`;
/**
 * Run a function on document-idle (DOMContentLoaded).
 * @function
 * @param {Function} func - The function to run.
 */
a.ready = (...args) => {
    a.on("DOMContentLoaded", ...args);
};
/**
 * Run function that is passed in on document-start (now), document-idle (DOMContentLoaded), and document-end (load).
 * @function
 * @param {Function} func - The function to run.
 */
a.always = (...args) => {
    func();
    a.on("DOMContentLoaded", ...args);
    a.on("load", ...args);
};
/**
 * Observe mutations of the document.
 * @function
 * @param {string} type - The type of mutation to observe. Currently only "insert" is accepted, this argument is for future expansion.
 * @param {Function} callback - The callback function, relevant data will be passed in.
 */
a.observe = (type, callback) => {
    //Initialize observer
    if (!a.observe.init.done) {
        a.observe.init.done = true;
        a.observe.init();
    }
    //Add to callback array
    switch (type) {
        case "insert":
            a.observe.insertCallbacks.push(callback);
            break;
        case "remove":
            a.observe.removeCallbacks.push(callback);
            break;
    }
    //More types will be added when needed
};
/**
 * Initialize MutationObserver.
 * This should only be called once by a.observe()
 * @function
 */
a.observe.init = () => {
    //Set up observer
    const observer = new a.win.MutationObserver((mutations) => {
        for (let i = 0; i < mutations.length; i++) {
            //Insert
            if (mutations[i].addedNodes.length) {
                for (let ii = 0; ii < a.observe.insertCallbacks.length; ii++) {
                    for (let iii = 0; iii < mutations[i].addedNodes.length; iii++) {
                        a.observe.insertCallbacks[ii](mutations[i].addedNodes[iii]);
                    }
                }
            }
            //Remove
            if (mutations[i].removedNodes.length) {
                for (let ii = 0; ii < a.observe.removeCallbacks.length; ii++) {
                    for (let iii = 0; iii < mutations[i].removedNodes.length; iii++) {
                        a.observe.removeCallbacks[ii](mutations[i].removedNodes[iii]);
                    }
                }
            }
            //More types will be added when needed
        }
    });
    observer.observe(a.doc, {
        childList: true,
        subtree: true
    });
};
/**
 * Whether initialization of MutationObserver is done.
 * @var {bool}
 */
a.observe.init.done = false;
/**
 * The callback functions for insert mutations.
 * @var {Array.<Function>}
 */
a.observe.insertCallbacks = [];
/**
 * The callback functions for remove mutations.
 * @var {Array.<Function>}
 */
a.observe.removeCallbacks = [];
/**
 * Returns a unique ID that is also a valid variable name.
 * @function
 * @return {string} Unique ID.
 */
a.uid = () => {
    const chars = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let str = "";
    for (let i = 0; i < 10; i++) {
        str += chars.charAt(a.win.Math.floor(a.win.Math.random() * chars.length));
    }
    a.uid.counter++;
    return str + a.uid.counter.toString();
};
/**
 * Unique ID counter, will be appended to randomly generated string to ensure uniqueness.
 * @var {integer}
 */
a.uid.counter = 0;
/**
 * SHA 256 hash function.
 * @function
 * @param {string} r - The string to hash.
 * @return {string} The SHA 256 hash string.
 */
a.sha256 = (r) => {
    //@pragma-keepline Based on work of Angel Marin and Paul Johnston
    //@pragma-keepline More information: http://www.webtoolkit.info/javascript-sha256.html
    function n(r, n) {
        var t = (65535 & r) + (65535 & n),
            e = (r >> 16) + (n >> 16) + (t >> 16);
        return e << 16 | 65535 & t;
    }
    function t(r, n) {
        return r >>> n | r << 32 - n;
    }
    function e(r, n) {
        return r >>> n;
    }
    function o(r, n, t) {
        return r & n ^ ~r & t;
    }
    function u(r, n, t) {
        return r & n ^ r & t ^ n & t;
    }
    function a(r) {
        return t(r, 2) ^ t(r, 13) ^ t(r, 22);
    }
    function f(r) {
        return t(r, 6) ^ t(r, 11) ^ t(r, 25);
    }
    function c(r) {
        return t(r, 7) ^ t(r, 18) ^ e(r, 3);
    }
    function i(r) {
        return t(r, 17) ^ t(r, 19) ^ e(r, 10);
    }
    function h(r, t) {
        var e, h, C, g, d, v, A, l, m, S, y, w, b = new Array(1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298),
            p = new Array(1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225),
            s = new Array(64);
        r[t >> 5] |= 128 << 24 - t % 32, r[(t + 64 >> 9 << 4) + 15] = t;
        for (m = 0; m < r.length; m += 16) {
            e = p[0], h = p[1], C = p[2], g = p[3], d = p[4], v = p[5], A = p[6], l = p[7];
            for (S = 0; 64 > S; S++) 16 > S ? s[S] = r[S + m] : s[S] = n(n(n(i(s[S - 2]), s[S - 7]), c(s[S - 15])), s[S - 16]), y = n(n(n(n(l, f(d)), o(d, v, A)), b[S]), s[S]), w = n(a(e), u(e, h, C)), l = A, A = v, v = d, d = n(g, y), g = C, C = h, h = e, e = n(y, w);
            p[0] = n(e, p[0]), p[1] = n(h, p[1]), p[2] = n(C, p[2]), p[3] = n(g, p[3]), p[4] = n(d, p[4]), p[5] = n(v, p[5]), p[6] = n(A, p[6]), p[7] = n(l, p[7]);
        }
        return p;
    }
    function C(r) {
        for (var n = Array(), t = (1 << v) - 1, e = 0; e < r.length * v; e += v) n[e >> 5] |= (r.charCodeAt(e / v) & t) << 24 - e % 32;
        return n;
    }
    function g(r) {
        r = r.replace(/\r\n/g, "\n");
        for (var n = "", t = 0; t < r.length; t++) {
            var e = r.charCodeAt(t);
            128 > e ? n += String.fromCharCode(e) : e > 127 && 2048 > e ? (n += String.fromCharCode(e >> 6 | 192), n += String.fromCharCode(63 & e | 128)) : (n += String.fromCharCode(e >> 12 | 224), n += String.fromCharCode(e >> 6 & 63 | 128), n += String.fromCharCode(63 & e | 128));
        }
        return n;
    }
    function d(r) {
        for (var n = A ? "0123456789ABCDEF" : "0123456789abcdef", t = "", e = 0; e < 4 * r.length; e++) t += n.charAt(r[e >> 2] >> 8 * (3 - e % 4) + 4 & 15) + n.charAt(r[e >> 2] >> 8 * (3 - e % 4) & 15);
        return t;
    }
    var v = 8,
        A = 0;
    return r = g(r), d(h(C(r), r.length * v));
};

//=====Generic=====
/**
 * Apply all generic solutions, this function should be called once from rules.
 * @function
 */
a.generic = () => {
    //@pragma-keepline Based on generic solutions of Anti-Adblock Killer, modified to fit our Core API
    //@pragma-keepline License: https://github.com/reek/anti-adblock-killer/blob/master/LICENSE
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
        //Playwire
        let playwireZeus;
        a.win.Object.defineProperty(a.win, "Zeus", {
            configurable: false,
            set(val) {
                playwireZeus = val;
            },
            get() {
                //Log
                a.config.debugMode && a.err("Playwire");
                //Patch and return
                try {
                    playwireZeus.AdBlockTester = {
                        check(a) { a(); }
                    };
                } catch (err) { }
                return playwireZeus;
            },
        });
        //===document-idle===
        a.ready(() => {
            //AdBlock Detector (XenForo Rellect)
            if (a.win.XenForo && typeof a.win.XenForo.rellect === "object") {
                //Log
                a.config.debugMode && a.err("XenForo");
                //Patch detector
                a.win.XenForo.rellect = {
                    AdBlockDetector: {
                        start() { }
                    }
                };
            }
            //Adbuddy
            if (typeof a.win.closeAdbuddy === "function") {
                //Log
                a.config.debugMode && a.err("Adbuddy");
                //Disable
                a.win.closeAdbuddy();
            }
            //AdBlock Alerter (WP)
            if (a.$("div.adb_overlay > div.adb_modal_img").length > 0) {
                //Log
                a.config.debugMode && a.err("AdBlock Alerter");
                //Remove alert and allow scrolling
                a.$("div.adb_overlay").remove();
                a.css("html, body { height:auto; overflow: auto; }");
            }
            //Block screen
            if (a.$("#blockdiv").html() === "disable ad blocking or use another browser without any adblocker when you visit") {
                //Log
                a.config.debugMode && a.out.err("Uncaught AdBlock Error: Generic block screens are not allowed on this device! ");
                //Remove block screen
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
                            //Log
                            a.config.debugMode && a.err("Antiblock.org v2");
                            //Set data for future uses
                            data.abo2 = id;
                            break;
                        }
                    }
                }
            }
            //BetterStopAdblock, Antiblock.org v3, and BlockAdBlock
            for (let prop in a.win) {
                try {
                    if (!prop.startsWith("webkit") &&
                        /^[a-z0-9]{4,12}$/i.test(prop) &&
                        prop !== "document" &&
                        (a.win[prop] instanceof a.win.HTMLDocument) === false && a.win.hasOwnProperty(prop) &&
                        typeof a.win[prop] === "object") {
                        const method = a.win[prop];
                        //BetterStopAdblock and Antiblock.org v3
                        if (method.deferExecution &&
                            method.displayMessage &&
                            method.getElementBy &&
                            method.getStyle &&
                            method.insert &&
                            method.nextFunction) {
                            if (method.toggle) {
                                //Log
                                a.config.debugMode && a.err("BetterStopAdblock");
                                //Set data for future uses
                                data.bsa = prop;
                            } else {
                                //Log
                                a.config.debugMode && a.err("Antiblock.org v3");
                                //Set data for future uses
                                data.abo3 = prop;
                            }
                            a.win[prop] = null;
                        }
                        //BlockAdBlock
                        if (method.bab) {
                            //Log
                            a.config.debugMode && a.err("BlockAdBlock");
                            //Remove property
                            a.win[prop] = null;
                        } else if (a.win.Object.keys(method).length === 3 && a.win.Object.keys(method).join().length === 32) {
                            //Log
                            a.config.debugMode && a.err("BlockAdBlock");
                            //Remove property
                            a.win[prop] = null;
                        }
                    }
                } catch (err) { }
            }
        });
        //===on-insert===
        const onInsertHandler = (insertedNode) => {
            //No-Adblock
            if (insertedNode.nodeName === "DIV" &&
                insertedNode.id &&
                insertedNode.id.length === 4 &&
                /^[a-z0-9]{4}$/.test(insertedNode.id) &&
                insertedNode.firstChild &&
                insertedNode.firstChild.id &&
                insertedNode.firstChild.id === insertedNode.id &&
                insertedNode.innerHTML.includes("no-adblock.com")) {
                //Log
                a.config.debugMode && a.err("No-Adblock");
                //Remove element
                insertedNode.remove();
            }
            //StopAdblock
            if (insertedNode.nodeName === "DIV" &&
                insertedNode.id &&
                insertedNode.id.length === 7 &&
                /^a[a-z0-9]{6}$/.test(insertedNode.id) &&
                insertedNode.parentNode &&
                insertedNode.parentNode.id &&
                insertedNode.parentNode.id === insertedNode.id + "2" &&
                insertedNode.innerHTML.includes("stopadblock.org")) {
                //Log
                a.config.debugMode && a.err("StopAdblock");
                //Remove element
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
                //Log
                a.config.debugMode && a.err("AntiAdblock");
                //Remove element
                insertedNode.remove();
            }
            //Adunblock
            const reId = /^[a-z]{8}$/;
            const reClass = /^[a-z]{8} [a-z]{8}/;
            const reBg = /^[a-z]{8}-bg$/;
            if (typeof a.win.vtfab !== "undefined" &&
                typeof a.win.adblock_antib !== "undefined" &&
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
                    a.config.debugMode && a.err("Adunblock Premium");
                    //Full Screen Message (Premium)
                    insertedNode.nextSibling.remove();
                    insertedNode.remove();
                } else if (insertedNode.nextSibling.id &&
                    reId.test(insertedNode.nextSibling.id) &&
                    insertedNode.innerHTML.includes("Il semblerait que vous utilisiez un bloqueur de publicité !")) {
                    //Log
                    a.config.debugMode && a.err("Adunblock Free");
                    //Top bar Message (Free)
                    insertedNode.remove();
                }
            }
            //Antiblock.org (all version)
            const reMsgId = /^[a-z0-9]{4,10}$/i;
            const reTag1 = /^(div|span|b|i|font|strong|center)$/i;
            const reTag2 = /^(a|b|i|s|u|q|p|strong|center)$/i;
            const reWords1 = /ad blocker|ad block|ad-block|adblocker|ad-blocker|adblock|bloqueur|bloqueador|Werbeblocker|adblockert|&#1570;&#1583;&#1576;&#1604;&#1608;&#1603; &#1576;&#1604;&#1587;|блокировщиком/i;
            const reWords2 = /kapat|disable|désactivez|désactiver|desactivez|desactiver|desative|desactivar|desactive|desactiva|deaktiviere|disabilitare|&#945;&#960;&#949;&#957;&#949;&#961;&#947;&#959;&#960;&#959;&#943;&#951;&#963;&#951;|&#1079;&#1072;&#1087;&#1088;&#1077;&#1097;&#1072;&#1090;&#1100;|állítsd le|publicités|рекламе|verhindert|advert|kapatınız/i;
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
                a.config.debugMode && a.err("Antiblock.org");
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
                    (insertedNode.firstChild.hasChildNodes() && insertedNode.firstChild.firstChild.nodeName === "IMG" && insertedNode.firstChild.firstChild.src.startsWith("data:image/png;base64"))) {
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
        //===Set up observer===
        a.observe("insert", onInsertHandler);
    } else if (a.config.debugMode) {
        //Generic solutions disabled log
        a.out.warn("Generic solutions are disabled on this domain. ");
    }
};
/**
 * Setup generic Adfly skipper, this function should be called once from a.init() if needed.
 * @function
 */
a.generic.AdflySkipper = () => {
    //@pragma-keepline Based on AdsBypasser
    //@pragma-keepline License: https://github.com/adsbypasser/adsbypasser/blob/master/LICENSE
    const handler = (encodedURL) => {
        if (a.doc.body) {
            //This is not an Adfly page
            return;
        }
        //Some checking
        const index = encodedURL.indexOf("!HiTommy");
        if (index >= 0) {
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
        let decodedURL = a.win.atob(var1 + var2);
        decodedURL = decodedURL.substr(2);
        if (a.win.location.hash) {
            decodedURL += a.win.location.hash;
        }
        //Make sure the URL is not obviously bad
        if (decodedURL.length > 3 && decodedURL.includes(".")) {
            //Stop the window
            a.win.stop();
            //Nuke body since we got the link
            //We would be so fast that the body is not loaded
            //a.doc.body.innerHTML = `<div><h2>Adfly skipped by uBlock Protector. Redirecting to real link: <a href="${decodedURL}">${decodedURL}</a></h2></div>`;
            //Redirect
            a.win.onbeforeunload = null;
            //a.win.onunload = null;
            a.win.location.href = decodedURL;
        }
    };
    //Setup variable hijacker
    try {
        let val;
        //Prevent running multiple times
        let flag = true;
        a.win.Object.defineProperty(a.win, "ysmm", {
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
                //In case this is not an Adfly page, we want this variable to be functional
                val = value;
            },
            get() {
                return val;
            },
        });
    } catch (err) {
        a.config.debugMode && a.out.error("uBlock Protector could not set up Adfly skipper. ");
    }
};
/**
 * Create a FuckAdBlock constructor and instance which always returns not detected.
 * @function
 * @param {string} constructorName - The name of the constructor.
 * @param {string} instanceName - The name of the instance.
 * @return {boolean} True if the operation was successful, false otherwise.
 */
a.generic.FuckAdBlock = (constructorName, instanceName) => {
    const patchedFuckAdBlock = function () {
        //@pragma-keepline Based on FuckAdBlock
        //@pragma-keepline License: https://github.com/sitexw/FuckAdBlock/blob/master/LICENSE
        //===Init===
        //On not detected callbacks
        this._callbacks = [];
        //Add on load event
        a.on("load", () => {
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
            a.config.debugMode && a.err("FuckAdBlock");
            if (!detected) {
                this._callbacks.push(func);
            }
            return this;
        };
        //Add on detected handler, do nothing
        this.onDetected = () => {
            //Log
            a.config.debugMode && a.err("FuckAdBlock");
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
    //Define FuckAdBlock to unsafeWindow and create its instance, error checks are done in a.readOnly()
    return a.readOnly(constructorName, patchedFuckAdBlock) && a.readOnly(instanceName, new a.win[constructorName]());
};
