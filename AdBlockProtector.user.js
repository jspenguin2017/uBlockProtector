// ==UserScript==
// @name AdBlock Protector
// @description Temporary solutions against AdBlock detectors
// @author X01X012013
// @version 1.0 beta 2
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
                console.info("eval() just received a call: ");
                console.log(str);
            }
            //Check if the string is allowed
            if (filter.test(str)) {
                //Not allowed
                if (doThrow) {
                    throw errMsg
                } else {
                    return console.error(errMsg);
                }
            } else {
                //Allowed
                return _eval(str);
            }
        };
    };
    //=====Rules=====
    activateEvalFilter(/blockadblock/i);
})();
