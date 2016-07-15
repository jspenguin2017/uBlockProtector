// ==UserScript==
// @name AdBlock Protector
// @description Temporary solutions against AdBlock detectors
// @author X01X012013
// @version 1.0.9
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
    const errMsg = "Uncaught AdBlock Error: AdBlocker detectors are not allowed on this device. ";
    const debugMode = true;
    //=====Common Functions=====
    //Activate Filters: Prevent a string or function with specific keyword from executing, works for: eval, setInterval
    //@param func (string): The name of the function to filter
    //@param [optional default=/.*/] filter (RegExp): Filter to apply, block everything if missing
    const activateFilter = function (func, filter) {
        //Messages
        const callMsg = " is called with these arguments: ";
        const passMsg = "Test passed. ";
        //Debug - Log when activated
        if (debugMode) {
            console.warn("Filter activating on " + func);
        }
        //Check filter
        if (filter === undefined) {
            filter = /.*/;
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
    switch (document.domain) {
        case "www.blockadblock.com":
        case "blockadblock.com":
            //Semi-permanent solution: Filter keyword from eval()
            activateEvalFilter(/blockadblock/i);
            break;
        case "www.gogi.in":
        case "gogi.in":
            //Temporary solution: Disable setInterval()
            activateSetIntervalFilter();
            break;
        case "www.comprovendolibri.it":
        case "comprovendolibri.it":
            //Semi-permanent solution: Lock TestPage()
            setReadOnly("TestPage", function () { });
            break;
        case "www.nordpresse.be":
        case "nordpresse.be":
            //Semi-permanent solution: Create message read cookie
            document.cookie = "anCookie=true";
            console.error(errMsg);
            break;
        case "www.sc2casts.com":
        case "sc2casts.com":
            //Temporary solution: Disable setTimeout() and lock scriptfailed()
            activateSetTimeoutFilter();
            setReadOnly("scriptfailed", function () { });
            break;
        default:
            //Debug mode
            if (debugMode) {
                console.warn("This website is not supported by AdBlock Protector");
            }
            break;
    }
    //Debug mode
    if (debugMode) {
        console.warn("Domain: " + document.domain);
    }
})();
