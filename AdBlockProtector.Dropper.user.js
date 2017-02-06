// ==UserScript==
// @name AdBlock Protector Script Dropper
// @description This is a dropper as a workaround for Greasemonkey
// @author X01X012013
// @version 1.0.7
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
    //Global variables used: ABP_details, ABP_XHR
    "use strict";
    //Sandbox escape
    const localCaller = function (url, onload, onerror) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            synchronous: true,
            onload: function (r) {
                onload(r.responseText);
            },
            onerror: function () {
                onerror();
            }
        });
    };
    const toExport = function () {
        let data = unsafeWindow.ABP_details;
        let url = data.url;
        let onload = function (d) {
            data.onload(d);
        };
        let onerror = function () {
            data.onerror();
        }
        localCaller(url, onload, onerror);
    };
    //Load script
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://x01x012013.github.io/AdBlockProtector/AdBlockProtector.user.js",
        synchronous: true,
        onload: function (response) {
            //Expose GM_xmlhttpRequest to content
            exportFunction(toExport, unsafeWindow, { defineAs: "ABP_XHR", allowCrossOriginArguments: true });
            //Patch and execute main script
            unsafeWindow.eval(response.responseText
                .replace("(function () {", "(function () { const unsafeWindow = window; const GM_xmlhttpRequest = function (d) { window.ABP_details = d; ABP_XHR(); }; ")
                .replace(/response\.responseText/g, "response")
            );
        },
        onerror: function () {
            alert("Could not load AdBlock Protector. ");
        }
    });
})()
