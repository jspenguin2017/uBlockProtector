// ==UserScript==
// @name AdBlock Protector
// @description Temporary solutions against AdBlock detectors
// @author X01X012013
// @version 1.0
// @encoding utf-8
// @include http://*/*
// @include https://*/*
// @grant unsafeWindow
// @run-at document-start
// @downloadURL https://x01x012013.github.io/AdBlockProtector/AdBlockProtector.user.js
// ==/UserScript==

(function() {
    'use strict';
	
    var _eval = unsafeWindow.eval;
    unsafeWindow.eval = function(str){
        if (str.match("blockadblock")) {
            console.error("eval() says: Refuse to execute: BlockAdBlock detected. ");
        } else {
            return _eval(str);
        }
    };
})();
