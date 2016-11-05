// ==UserScript==
// @name AdBlock Protector
// @description Solutions against AdBlock detectors
// @author X01X012013
// @version 1.2.12
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
     * Prevent a string or function with specific keyword from executing.
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
            // [native code] Anti detection
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
                    writable: false
                });
            } else {
                //One layer
                Object.defineProperty(unsafeWindow, name, {
                    value: val,
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
    //Debug - Log domain
    if (debugMode) {
        console.warn("Domain: " + Domain);
    }
    //Exact matching
    switch (Domain) {
        case "www.blockadblock.com":
        case "blockadblock.com":
            //Stable solution: Filter keyword from eval()
            activateFilter("eval", /BlockAdblock/);
            onEvent("load", function () {
                $("#babasbmsgx").remove();
            });
            break;
        case "www.gogi.in":
            //Temporary solution: Disable setInterval()
            activateFilter("setInterval");
            break;
        case "www.comprovendolibri.it":
            //Stable solution: Lock TestPage()
            setReadOnly("TestPage", function () { });
            break;
        case "nordpresse.be":
            //Stable solution: Set cookie anCookie to true
            document.cookie = "anCookie=true";
            console.error(errMsg);
            break;
        case "sc2casts.com":
            //Temporary solution: Lock scriptfailed() and disable setTimeout()
            setReadOnly("scriptfailed", function () { });
            activateFilter("setTimeout");
            break;
        case "bollywood.divyabhaskar.co.in":
            //Stable solution: Lock canABP to true
            setReadOnly("canABP", true);
            break;
        case "graffica.info":
            //Temporary solution: Diable setTimeout()
            activateFilter("setTimeout");
            break;
        case "www.dawn.com":
            //Stable solution: Homemade FuckAdBlock, can be countered the same way
            setReadOnly("DetectAdBlock", function () { });
            Object.freeze(unsafeWindow.DetectAdBlock.prototype);
            setReadOnly("detectAdBlock", new unsafeWindow.DetectAdBlock());
            break;
        case "infotainment.jagranjunction.com":
            //Stable solution: Lock canRunAds and isAdsDisplayed to true
            setReadOnly("canRunAds", true);
            setReadOnly("isAdsDisplayed", true);
            break;
        case "www.australianfrequentflyer.com.au":
        case "www.livenewschat.eu":
        case "www.zahitvstation.com":
        case "haxoff.com":
        case "fullstuff.co":
        case "www.usapoliticstoday.com":
            //Temporary solution: Disable eval()
            activateFilter("eval");
            break;
        case "www.jagran.com":
        case "www.hindustantimes.com":
        case "www.mid-day.com":
        case "malayalam.samayam.com":
            //Stable solution: Lock canRun to true
            setReadOnly("canRun", true);
            break;
        case "www.qbasic.net":
            //Stable solution: Lock dload to a special version
            setReadOnly("dload", function (dlID, fileID) {
                ga("send", "event", "Download", "Submit", fileID);
                location.href = "http://" + window.location.hostname + "/dl.php?id=" + dlID + "&file=" + fileID;
                window.success = true;
                return success;
            });
            break;
        case "www.happytrips.com":
            //Stable solution: Lock canRun to true and detector to an empty function
            setReadOnly("canRun", true);
            setReadOnly("detector", function () { });
            break;
        case "www.scambiofile.info":
        case "scambiofile.info":
            //Stable solution: Lock iExist to true
            setReadOnly("iExist", true);
            break;
        case "www.lasprovincias.es":
            //Stable solution: Create variable Vocento.checkAdBlock and set it to 1
            unsafeWindow.Vocento = { checkAdBlock: 1 };
            console.error(errMsg);
            break;
        case "www.badtaste.it":
        case "www.badtv.it":
        case "www.badcomics.it":
        case "www.badgames.it":
            //Stable solution: Lock isAdBlockActive to false and set cookie adBlockChecked to disattivo
            setReadOnly("isAdBlockActive", false);
            document.cookie = "adBlockChecked=disattivo";
            break;
        case "ay.gy":
            //Temporary solution: Disable open() before page starts to load and set abgo to an empty function when the page loads
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
        case "www.15min.lt":
            //Stable solution: Homemade FuckAdBlock, can be countered the same way
            setReadOnly("blocker", function () {
                this.hasAdblock = function () { return false; };
                this.onBlock = function () { };
                this.runTests = function () { };
                this.test = function () { };
                this.testAll = function () { };
            });
            break;
        case "indiatoday.intoday.in":
            //Stable solution: Lock adBlock to false
            setReadOnly("adBlock", false);
            break;
        case "www.businesstoday.in":
            //Stable solution: Lock checkAds to an empty function
            setReadOnly("checkAds", function () { });
            break;
        case "indianexpress.com":
        case "www.jansatta.com":
        case "www.financialexpress.com":
            //Stable solution: Lock RunAds to true
            setReadOnly("RunAds", true);
            break;
        case "www.livemint.com":
            //Stable solution: Lock canRun1 to true
            setReadOnly("canRun1", true);
            break;
        case "www.business-standard.com":
            //Stable solution: Lock isBannerActive and adsLoaded to true
            setReadOnly("isBannerActive", true);
            setReadOnly("adsLoaded", true);
            break;
        case "userscloud.com":
            //Temporary solution: Show hidden div and remove block screen
            onEvent("load", function () {
                $("#dl_link").show();
                $("#adblock_msg").remove();
            });
            break;
        default:
            //Debug - Log when not in exact match list
            if (debugMode) {
                console.warn(Domain + " is not in AdBlock Protector's exact match list. ");
            }
            break;
    }
    //Partial matching
    if (Domain === "x01x012013.github.io" || (debugMode && Domain === "localhost")) {
        //Installation test of homepage
        setReadOnly("AdBlock_Protector_testVar", true);
    } else if (Domain.endsWith(".bhaskar.com")) {
        //Stable solution: Lock canABP to true
        setReadOnly("canABP", true);
    } else if (Domain.endsWith(".gamepedia.com")) {
        //Temporary workaround: Remove element
        onEvent("load", function () {
            $("#atflb").remove();
        });
    } else if (Domain.endsWith(".cbox.ws")) {
        //Stable solution: Lock koddostu_com_adblock_yok to true
        setReadOnly("koddostu_com_adblock_yok", true);
    } else if (Domain === "indiatimes.com" || Domain.endsWith(".indiatimes.com") || Domain.endsWith(".ahmedabadmirror.com")) {
        //Temporary solution: Filter keyword from document.addEventListener()
        activateFilter("document.addEventListener", /function \_0x/);
    } else if (Domain.endsWith(".ndtv.com")) {
        //Stable solution: Lock getNoTopLatestNews to an empty function
        setReadOnly("getNoTopLatestNews", function () { });
    } else if (debugMode) {
        //Debug - Log when not in partial match list
        console.warn(Domain + " is not in AdBlock Protector's partial match list. ");
    }
})();
