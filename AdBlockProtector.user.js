// ==UserScript==
// @name AdBlock Protector
// @description Temporary solutions against AdBlock detectors
// @author X01X012013
// @version 1.0 beta 3
// @encoding utf-8
// @include http://*/*
// @include https://*/*
// @grant unsafeWindow
// @run-at document-start
// @downloadURL https://x01x012013.github.io/AdBlockProtector/AdBlockProtector.user.js
// ==/UserScript==

(function () {
    'use strict';
    let debugMode = true;
    //=====Common Functions=====
    //ActivateEval Filter: prevent string with specific keywords from executing
    //@param filter (RegExp): Filter used to test string before it goes into eval()
    //@param [optional default=false] doThrow (boolean): If true, eval() will throw when the string did not pass the test
    const activateEvalFilter = function (filter, doThrow) {
        const errMsg = "Uncaught AdBlock Error: AdBlocker detectors are not allowed. ";
        let _eval = unsafeWindow.eval;
        unsafeWindow.eval = function (str) {
            //Debug mode
            if (debugMode) {
                console.warn("eval() just received a call: ");
                console.warn(str);
            }
            //Check if the string is allowed
            if (filter.test(str)) {
                //Not allowed
                if (doThrow) {
                    throw errMsg;
                } else {
                    return console.error(errMsg);
                }
            } else {
                //Allowed
                return _eval(str);
            }
        };
        //Debug mode
        if(debugMode){
            console.warn("Eval Filter activated. ");
        }
    };
    //=====Rules=====
    switch (document.domain) {
        case "blockadblock.com":
            activateEvalFilter(/blockadblock/i);
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
