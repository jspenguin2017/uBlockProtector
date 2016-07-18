// ==UserScript==
// @name AdBlock Protector
// @description Temporary solutions against AdBlock detectors
// @author X01X012013
// @version 1.0.23
// @encoding utf-8
// @include http://*/*
// @include https://*/*
// @grant unsafeWindow
// @run-at document-start
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
    };
    const activateEvalFilter = activateFilter.bind(null, "eval");
    const activateSetIntervalFilter = activateFilter.bind(null, "setInterval");
    const activateSetTimeoutFilter = activateFilter.bind(null, "setTimeout");
    //Define read-only property
    //@param name (string): The name of the property to define on unsafeWindow
    //@param val (mix): The value of the property
    const setReadOnly = function (name, val) {
        Object.defineProperty(unsafeWindow, name, {
            value: val,
            writable: false
        });
        console.error(errMsg);
    };
    //=====Rules=====
    //Debug - Log domain
    if (debugMode) {
        console.warn("Domain: " + document.domain);
    }
    switch (document.domain) {
        case "www.blockadblock.com":
        case "blockadblock.com":
            //Semi-permanent solution: Filter keyword from eval()
            activateEvalFilter(/blockadblock/i);
            break;
        case "www.gogi.in":
            //Temporary solution: Disable setInterval()
            activateSetIntervalFilter();
            break;
        case "www.comprovendolibri.it":
            //Semi-permanent solution: Lock TestPage()
            setReadOnly("TestPage", function () { });
            break;
        case "nordpresse.be":
            //Semi-permanent solution: Create message read cookie
            document.cookie = "anCookie=true";
            console.error(errMsg);
            break;
        case "sc2casts.com":
            //Temporary solution: Lock scriptfailed() and disable setTimeout()
            setReadOnly("scriptfailed", function () { });
            activateSetTimeoutFilter();
            break;
        case "bollywood.divyabhaskar.co.in":
        case "bollywood.bhaskar.com":
            //Semi-permanent solution: Lock canABP to true
            setReadOnly("canABP", true);
            break;
        case "graffica.info":
            //Temporary solution: Diable setTimeout()
            activateSetTimeoutFilter();
            break;
        case "www.dawn.com":
            //Semi-permanent solution: Homemade FuckAdBlock, can be countered the same way
            setReadOnly("DetectAdBlock", function () { });
            Object.freeze(unsafeWindow.DetectAdBlock.prototype);
            setReadOnly("detectAdBlock", new unsafeWindow.DetectAdBlock());
            break;
        case "www.trovesaurus.com":
            //Temporary solution: Remove elements when page loads - Those elements will show for a few seconds
            unsafeWindow.addEventListener("load", function () {
                $("#blocked").remove();
                $("a.btn.btn-success:contains('adverts with a donation')").remove();
                console.error(errMsg);
            });
            break;
        case "infotainment.jagranjunction.com":
            //Semi-permanent solution: Lock canRunAds and isAdsDisplayed to true
            setReadOnly("canRunAds", true);
            setReadOnly("isAdsDisplayed", true);
            break;
        case "www.dogefaucet.com":
            //Temporary solution: Undo block - Those elements will show for a few seconds
            unsafeWindow.addEventListener("load", function () {
                $("#loading_frame").removeClass("blocked");
                $(".loader").hide();
                $("#inputSecurity").val("");
                $("#ask_form").find(".loading").attr("disabled", false);
                console.error(errMsg);
            });
            break;
        case "www.australianfrequentflyer.com.au":
            //Temporary solution: Disable eval()
            activateEvalFilter();
            break;
        case "www.jagran.com":
        case "timesofindia.indiatimes.com":
            //Semi-permanent solution: Lock canRun to true
            setReadOnly("canRun", true);
            break;
        case "www.qbasic.net":
            //Semi-permanent solution: Lock dload to a special version
            setReadOnly("dload", function (dlID, fileID) {
                ga('send', 'event', 'Download', 'Submit', fileID);
                location.href = 'http://' + window.location.hostname + '/dl.php?id=' + dlID + '&file=' + fileID;
                window.success = true;
                return success;
            });
            break;
        case "www.happytrips.com":
            //Semi-permanent solution: Lock canRun to true and detector to an empty function
            setReadOnly("canRun", true);
            setReadOnly("detector", function () { });
            break;
        case "www.scambiofile.info":
        case "scambiofile.info":
            //Semi-permanent solution: Lock iExist to true
            setReadOnly("iExist", true);
            break;
        default:
            //Not supported
            console.warn(document.domain + " is not supported by AdBlock Protector");
            break;
    }
})();
