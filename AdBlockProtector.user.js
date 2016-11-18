// ==UserScript==
// @name AdBlock Protector Script
// @description Quick solutions against AdBlock detectors
// @author X01X012013
// @version 3.0.5
// @encoding utf-8
// @include http://*/*
// @include https://*/*
// @grant unsafeWindow
// @run-at document-start
// @homepage https://x01x012013.github.io/AdBlockProtector/
// @supportURL https://github.com/X01X012013/AdBlockProtector/issues
// @downloadURL https://x01x012013.github.io/AdBlockProtector/AdBlockProtector.user.js
// ==/UserScript==

(function () {
    "use strict";
    /**
     * Whether or not debug string should be logged.
     * @const {boolean}
     */
    const debugMode = true;
    //=====Library=====
    /**
     * The error message to show when this script takes effect.
     * @const {string}
     */
    const errMsg = "Uncaught AdBlock Error: AdBlocker detectors are not allowed on this device. ";
    /**
     * Pointers to functions to hide.
     * This array and {@link filterString} are parallel arrays, and is used in {@link hideFilters}.
     * @var {Function}
     */
    let filterPointers = [];
    /**
     * The string values of the real function.
     * This array and {@link filterPointer} are parallel arrays, and is used in {@link hideFilters}.
     * @var {string}
     */
    let filterStrings = [];
    /**
     * Replace Function.prototype.toString() in order to prevent filters from being detected.
     * Do not call this function multiple times.
     * @function
     * @return {boolean} True if the operation was successful, false otherwise.
     */
    const hideFilters = function () {
        //The original function
        const original = unsafeWindow.Function.prototype.toString;
        //New function
        const newFunc = function () {
            //Check if this function is in the protected list
            const index = filterPointers.indexOf(this);
            if (index !== -1) {
                //Protected, return the string value of the real function instead
                return filterStrings[index];
            } else {
                //Not protected, use original function to proceed
                return original.apply(this);
            }
        };
        //Try to replace the function
        try {
            //Replace function
            unsafeWindow.Function.prototype.toString = newFunc;
            //Protect this function as well
            filterPointers.push(newFunc);
            filterStrings.push(original.toString());
            //Debug - Log when activated
            if (debugMode) {
                console.warn("Filters hidden. ");
            }
        } catch (err) {
            //Failed to activate (will always log)
            console.error("Failed to hide filters! ");
            return false;
        }
        return true;
    };
    /**
     * Adds a filter to another function so arguments with forbidden keywords are not allowed.
     * Use RegExp to combine filters, do not activate filter multiple times on the same function.
     * @function
     * @param {string} func - The name of the function to filter, use "." to separate multiple layers, max 2 layers.
     * @param {RegExp} [filter=/[\S\s]/] - Filter to apply, block everything if this argument is missing.
     * @return {boolean} True if the operation was successful, false otherwise.
     */
    const activateFilter = function (func, filter) {
        //Default parameters
        filter = filter || /[\S\s]/;
        //Messages
        const callMsg = " is called with these arguments: ",
              passMsg = "Test passed. ",
              activateMsg = "Filter activated on ",
              failedMsg = "AdBlock Protector failed to activate filter on ";
        //The original function, will be set later
        let original;
        //The function names array, will be set later if there is more than one layer
        let fNames;
        //The function with filters
        const newFunc = function () {
            //Debug - Log when called
            if (debugMode) {
                console.warn(((typeof func === "string") ? func : func.join(".")) + callMsg);
                for (let i = 0; i < arguments.length; i++) {
                    console.warn(arguments[i].toString());
                }
            }
            //Apply filter
            for (let i = 0; i < arguments.length; i++) {
                if (filter.test(arguments[i].toString())) {
                    //Not allowed (will always log)
                    return console.error(errMsg);
                }
            }
            //Debug - Log when passed
            if (debugMode) {
                console.info(passMsg);
            }
            //Allowed
            if (typeof fNames === "object") {
                //Two layers
                return original.apply(unsafeWindow[fNames[0]], arguments);
            } else {
                //One layer
                return original.apply(unsafeWindow, arguments);
            }
        };
        //Try to replace the function
        try {
            //Replace function
            if (func.includes(".")) {
                //Two layers
                fNames = func.split(".");
                original = unsafeWindow[fNames[0]][fNames[1]];
                unsafeWindow[fNames[0]][fNames[1]] = newFunc;
            } else {
                //One layer
                original = unsafeWindow[func];
                unsafeWindow[func] = newFunc;
            }
            //Add this filter to protection list
            filterPointers.push(newFunc);
            filterStrings.push(original.toString());
            //Debug - Log when activated
            if (debugMode) {
                console.warn(activateMsg + func);
            }
        } catch (err) {
            //Failed to activate (will always log)
            console.error(failedMsg + func + "! ");
            return false;
        }
        return true;
    };
    /**
     * Defines a read-only property to unsafeWindow.
     * @function
     * @param {string} name - The name of the property to define.
     * @param {*} val - The value to set.
     * @return {boolean} True if the operation was successful, false otherwise.
     */
    const setReadOnly = function (name, val) {
        //Try to set read only variable
        try {
            if (name.includes(".")) {
                //Two layers
                let nameArray = name.split(".");
                Object.defineProperty(unsafeWindow[nameArray[0]], nameArray[1], {
                    value: val,
                    configurable: false,
                    writable: false
                });
            } else {
                //One layer
                Object.defineProperty(unsafeWindow, name, {
                    value: val,
                    configurable: false,
                    writable: false
                });
            }
            console.error(errMsg);
        } catch (err) {
            //Failed to activate (will always log)
            console.error("AdBlock Protector failed to define read-only property " + name + "! ");
            return false;
        }
        return true;
    };
    /**
     * Run a function when an event triggers.
     * @function
     * @param {string} event - The name of the event.
     * @param {Function} func - The function to run.
     */
    const onEvent = function (event, func) {
        unsafeWindow.addEventListener(event, func);
        console.error(errMsg);
    };
    /**
     * Shortcut to document.domain.
     * @const {string}
     */
    const Domain = document.domain;
    //=====Main=====
    //Hide filters
    hideFilters();
    //Debug - Log domain
    if (debugMode) {
        console.warn("Domain: " + Domain);
    }
    //Exact matching
    switch (Domain) {
        case "www.blockadblock.com":
        case "blockadblock.com":
            //Filter keyword from eval() and remove element with ID babasbmsgx on load
            activateFilter("eval", /aa2thYWHXUFDUPDzUOTno0dHipqbceHjaZ2dCQkLSLy/);
            onEvent("load", function () {
                $("#babasbmsgx").remove();
            });
            break;
        case "sc2casts.com":
            //Lock scriptfailed() and disable setTimeout()
            setReadOnly("scriptfailed", function () { });
            activateFilter("setTimeout");
            break;
        case "infotainment.jagranjunction.com":
            //Lock canRunAds and isAdsDisplayed to true
            setReadOnly("canRunAds", true);
            setReadOnly("isAdsDisplayed", true);
            break;
        case "www.usapoliticstoday.com":
            //Disable eval()
            activateFilter("eval");
            break;
        case "ay.gy":
            //This fix is currently better than AAK's fix, so we are keeping this for now
            //Disable open() before page starts to load and set abgo to an empty function when the page loads
            setReadOnly("open", function () { });
            onEvent("load", function () {
                unsafeWindow.abgo = function () { };
            });
            //Skip countdown
            const _setInterval = unsafeWindow.setInterval;
            unsafeWindow.setInterval = function (func) {
                return _setInterval(func, 10);
            };
            break;
        case "www.jansatta.com":
            //Lock RunAds to true
            setReadOnly("RunAds", true);
            break;
        case "www.livemint.com":
            //SLock canRun1 to true
            setReadOnly("canRun1", true);
            break;
        case "userscloud.com":
            //Show hidden div and remove block screen
            onEvent("load", function () {
                $("#dl_link").show();
                $("#adblock_msg").remove();
            });
            break;
        case "www.vidlox.tv":
        case "vidlox.tv":
            //Lock xRds to false and cRAds to true
            setReadOnly("xRds", false);
            setReadOnly("cRAds", true);
            break;
        case "www.cwtv.com":
        case "cwtv.com":
            //Lock wallConfig to false - Thanks to szymon1118
            setReadOnly("wallConfig", false);
            break;
        default:
            //Debug - Log when not in exact match list
            if (debugMode) {
                console.warn(Domain + " is not in AdBlock Protector's exact match list. ");
            }
            break;
    }
    //Partial matching
    if (Domain === "x01x012013.github.io" && document.location.href.indexOf("x01x012013.github.io/AdBlockProtector") !== -1) {
        //Installation test of homepage
        unsafeWindow.AdBlock_Protector_Script = true;
    } else if (Domain.endsWith(".gamepedia.com")) {
        //(Workaround) Remove element
        onEvent("load", function () {
            $("#atflb").remove();
        });
    } else if (Domain.endsWith(".cbox.ws")) {
        //Lock koddostu_com_adblock_yok to true
        setReadOnly("koddostu_com_adblock_yok", true);
    } else if (Domain.endsWith(".ahmedabadmirror.com")) {
        //Filter keyword from document.addEventListener()
        activateFilter("document.addEventListener", /function \_0x/);
        //document.addEventListener should not be native code, but they are expecting native code, strange...
        filterStrings[1] = "function addEventListener() { [native code] }";
    } else if (Domain.endsWith(".pinkrod.com") || Domain.endsWith(".wetplace.com")) {
        //Lock getAd and getUtm to an empty function
        setReadOnly("getAd", function () { });
        setReadOnly("getUtm", function () { });
    } else if (debugMode) {
        //Debug - Log when not in partial match list
        console.warn(Domain + " is not in AdBlock Protector's partial match list. ");
    }
    //TV Nowa (Workaround)
    (function () {
        //Thanks to mikhoul and xxcriticxx for your precious help!
        let domainExact = []; //"tvnfabula.pl", "itvnextra.pl", "tvn24bis.pl", "ttv.pl", "player.pl", "x-news.pl"
        let domainPartial = [".tvn.pl", ".tvnstyle.pl", ".tvnturbo.pl"]; //".tvn7.pl", ".itvn.pl"
        let homePages = ["http://www.tvn.pl/", "http://www.tvn7.pl/", "http://www.tvnstyle.pl/", "http://www.tvnturbo.pl/"];
        //Check homepage first
        if (homePages.includes(document.location.href)) {
            //Home pages are currently handled by List
        } else {
            //Check exact domain
            let isTVN = domainExact.includes(Domain);
            //Check partial domain
            for (let i = 0; i < domainPartial.length; i++) {
                if (Domain.endsWith(domainPartial[i])) {
                    isTVN = true;
                    break;
                }
            }
            //Apply video patch
            if (isTVN) {
                //Temporary workaround: Replace the player
                onEvent("load", function () {
                    $(".videoPlayer").parent().after($("<iframe width='100%' height='500px'>").attr("src", $(".videoPlayer").data("src"))).remove();
                });
            }
        }
    })();
})();
