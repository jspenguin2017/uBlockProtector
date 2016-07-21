// ==UserScript==
// @name AdBlock Protector
// @description Temporary solutions against AdBlock detectors
// @author X01X012013
// @version 1.0.49
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
    'use strict';
    //Constants
    const debugMode = true;
    const errMsg = "Uncaught AdBlock Error: AdBlocker detectors are not allowed on this device. ";
    //=====Common Functions=====
    //Activate Filters: Prevent a string or function with specific keyword from executing, works for: eval, setInterval
    //@param func (string): The name of the function to filter
    //@param [optional default=/[\S\s]/] filter (RegExp): Filter to apply, block everything if this argument is missing
    const activateFilter = function (func, filter) {
        //Messages
        const callMsg = " is called with these arguments: ";
        const passMsg = "Test passed. ";
        //Check filter
        if (filter === undefined) {
            filter = /[\S\s]/;
        }
        //Replace function
        const original = unsafeWindow[func];
        try {
            unsafeWindow[func] = function () {
                //Debug - Log when called
                if (debugMode) {
                    console.warn(func + callMsg);
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
                return original.apply(unsafeWindow, arguments);
            };
            //Debug - Log when activated
            if (debugMode) {
                console.warn("Filter activated on " + func);
            }
        } catch (err) {
            console.error("AdBlock Protector failed to activate filter on " + func + "! ");
        }
    };
    const activateEvalFilter = activateFilter.bind(null, "eval");
    const activateSetIntervalFilter = activateFilter.bind(null, "setInterval");
    const activateSetTimeoutFilter = activateFilter.bind(null, "setTimeout");
    //Define read-only property
    //@param name (string): The name of the property to define on unsafeWindow
    //@param val (mix): The value of the property
    const setReadOnly = function (name, val) {
        try {
            Object.defineProperty(unsafeWindow, name, {
                value: val,
                writable: false
            });
            console.error(errMsg);
        } catch (err) {
            console.error("AdBlock Protector failed to define read-only property " + name + "! ");
        }
    };
    //Run when page loads
    //@paran func (Function): The function to run
    const runOnLoad = function (func) {
        unsafeWindow.addEventListener("load", func);
        console.error(errMsg);
    };
    //Shortcut to document.domain
    const Domain = document.domain;
    //=====Rules=====
    //Debug - Log domain
    if (debugMode) {
        console.warn("Domain: " + Domain);
    }
    //Exact matching
    switch (Domain) {
        case "x01x012013.github.io":
            //Installation test of homepage
            setReadOnly("testVar", true);
            break;
        case "www.blockadblock.com":
        case "blockadblock.com":
            //Stable solution: Filter keyword from eval()
            activateEvalFilter(/blockadblock/i);
            break;
        case "www.gogi.in":
            //Temporary solution: Disable setInterval()
            activateSetIntervalFilter();
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
            activateSetTimeoutFilter();
            break;
        case "bollywood.divyabhaskar.co.in":
            //Stable solution: Lock canABP to true
            setReadOnly("canABP", true);
            break;
        case "graffica.info":
            //Temporary solution: Diable setTimeout()
            activateSetTimeoutFilter();
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
            //Temporary solution: Disable eval()
            activateEvalFilter();
            break;
        case "www.jagran.com":
        case "www.hindustantimes.com":
        case "www.mid-day.com":
            //Stable solution: Lock canRun to true
            setReadOnly("canRun", true);
            break;
        case "www.qbasic.net":
            //Stable solution: Lock dload to a special version
            setReadOnly("dload", function (dlID, fileID) {
                ga('send', 'event', 'Download', 'Submit', fileID);
                location.href = 'http://' + window.location.hostname + '/dl.php?id=' + dlID + '&file=' + fileID;
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
            runOnLoad(function () {
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
            //Stable solution: Lock checkAds to an empty function
            setReadOnly("checkAds", function () { });
            break;
        default:
            //Debug - Log when not in exact match list
            if (debugMode) {
                console.warn(Domain + " is not in AdBlock Protector's exact match list. ");
            }
            break;
    }
    //Partial matching
    if (Domain.indexOf(".bhaskar.com") != -1) {
        //Stable solution: Lock canABP to true
        setReadOnly("canABP", true);
    } else if (Domain.indexOf(".gamepedia.com") != -1) {
        //Temporary workaround: Remove element
        runOnLoad(function () {
            $("#atflb").remove();
        });
    } else if (Domain.indexOf(".cbox.ws") != -1) {
        //Stable solution: Lock koddostu_com_adblock_yok to true
        setReadOnly("koddostu_com_adblock_yok", true);
    } else if (Domain.indexOf(".indiatimes.com") != -1) {
        //Stable solution: Lock canRun to true
        setReadOnly("canRun", true);
    } else if (debugMode) {
        //Debug - Log when not in partial match list
        console.warn(Domain + " is not in AdBlock Protector's partial match list. ");
    }
})();
