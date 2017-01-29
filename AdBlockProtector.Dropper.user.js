// ==UserScript==
// @name AdBlock Protector Script Dropper
// @description This is a dropper as a workaround for Greasemonkey
// @author X01X012013
// @version 1.0.0
// @encoding utf-8
// @include http://*/*
// @include https://*/*
// @grant GM_xmlhttpRequest
// @run-at document-start
// @homepage https://x01x012013.github.io/AdBlockProtector/
// @supportURL https://github.com/X01X012013/AdBlockProtector/issues
// @downloadURL https://x01x012013.github.io/AdBlockProtector/AdBlockProtector.Dropper.user.js
// ==/UserScript==

(function () {
    "use strict";
    //Set unsafeWindow
    window.eval("const unsafeWindow = window;");
    //Drop script
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://x01x012013.github.io/AdBlockProtector/AdBlockProtector.GM_Dropper.user.js",
        onload: function (response) {
            window.eval(response.responseText);
        }
    });
})();
