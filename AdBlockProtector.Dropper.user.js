// ==UserScript==
// @name AdBlock Protector Script Dropper
// @description This is a dropper as a workaround for Greasemonkey
// @author X01X012013
// @version 1.0.4
// @encoding utf-8
// @include http://*/*
// @include https://*/*
// @grant unsafeWindow
// @grant GM_xmlhttpRequest
// @connect *
// @run-at document-start
// @homepage https://x01x012013.github.io/AdBlockProtector/
// @supportURL https://github.com/X01X012013/AdBlockProtector/issues
// @downloadURL https://x01x012013.github.io/AdBlockProtector/AdBlockProtector.Dropper.user.js
// ==/UserScript==

(function () {
    //Load script
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://x01x012013.github.io/AdBlockProtector/AdBlockProtector.user.js",
        synchronous: true,
        onload: function (response) {
            unsafeWindow.eval(response.responseText.replace("(function () {", "(function () { var unsafeWindow = window;"));
            //(Workaround) Give main script access to GM_xmlhttpRequest
            Components.utils.exportFunction(GM_xmlhttpRequest, unsafeWindow);
        },
        onerror: function () {
            alert('Could not load AdBlock Protector. ');
        }
    });
})()
