// ==UserScript==
// @name AdBlock Protector
// @description Temporary solutions against AdBlock detectors
// @author X01X012013
// @version 1.0.2
// @encoding utf-8
// @include http://*/*
// @include https://*/*
// @grant unsafeWindow
// @run-at document-start
// @downloadURL https://x01x012013.github.io/AdBlockProtector/AdBlockProtector.user.js
// ==/UserScript==

(function () {
    'use strict';
    //Constants
    const debugMode = true;
    //=====Common Functions=====
    //Activate Filters: Prevent a string or function with specific keyword from executing, works for: eval, setInterval
    //@param func (string): The name of the function to filter
    //@param [optional default=/\S\s/] filter (RegExp): Filter to apply, block everything if missing
    const activateFilter = function (func, filter) {
        //Messages
        const errMsg = "Uncaught AdBlock Error: AdBlocker detectors are not allowed. ";
        const callMsg = "The following string or function will be filtered then executed if allowed by ";
        const passMsg = "Last string or function passed the test and will be executed. ";
        //Debug - Log when activated
        if (debugMode) {
            console.warn("Filter activating on " + func);
        }
        //Check filter
        if (filter === undefined) {
            filter = /\S\s/;
        }
        //Replace function
        const original = unsafeWindow[func];
        unsafeWindow[func] = function (data) {
            //Debug - Log when called
            if (debugMode) {
                console.warn(callMsg + func + ". ");
                console.warn(data);
            }
            //Apply filter
            if (filter.test(data)) {
                //Not allowed (will always log)
                return console.error(errMsg);
            } else {
                //Debug - Log when passed
                if (debugMode) {
                    console.log(passMsg);
                }
                //Allowed
                return _eval(data);
            }
        };
    };
    const activateEvalFilter = activateFilter.bind(null, "eval");
    const activateSetIntervalFilter = activateFilter.bind(null, "setInterval");
    //=====Rules=====
    switch (document.domain) {
        case "www.blockadblock.com":
        case "blockadblock.com":
            //Filter keyword
            activateEvalFilter(/blockadblock/i);
            break;
        case "www.gogi.in":
        case "gogi.in":
            //Temporary solution: Disable setInterval
            activateSetIntervalFilter();
            break;
        default:
            //Debug mode
            if (debugMode) {
                console.warn("This website is not supported");
            }
    }
    //Debug mode
    if (debugMode) {
        console.warn("Domain: " + document.domain);
    }
})();
