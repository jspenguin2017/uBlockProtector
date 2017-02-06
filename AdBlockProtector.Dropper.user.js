// ==UserScript==
// @name AdBlock Protector Script Dropper
// @description This is a dropper as a workaround for Greasemonkey
// @author X01X012013
// @version 1.0.6
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
    "use strict";
    //Sandbox escape
    const localCaller = function (url, onload, onerror) {
        console.log(url);
        console.log(onload.toString());
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            synchronous: true,
            onload: function (r) {
                //unsafeWindow.eval(r.responseText.replace(/\"use strict\";/g, ""));
                onload(r.responseText);
            },
            onerror: function () {
                onerror();
            }
        });
    };
    const toExport = function () {
        let data = unsafeWindow.ABP_details;
        console.log(data);
        console.log(data.onload);
        //console.log(data.onload.toString());
        console.log("test");
        try {
            let url = data.url;
            let onload = function (d) {
                console.log(d);
                console.log(data.onload);
                console.log(data.onload.toString());
                try { data.onload(d); } catch (err) { console.log(err); }
            };
            let onerror = function () {
                data.onerror();
            }
            localCaller(url, onload, onerror);
        } catch (e) {
            console.log(e);
        }
    };
    /*/*
    const toExport = function () {
        console.log("toExport called");
        console.log(unsafeWindow.ABP_details);

        console.log(unsafeWindow.ABP_details.onload);

        console.log(unsafeWindow.ABP_details.onload.toString());
        GM_xmlhttpRequest(unsafeWwindow.ABP_details)
    };*/
    try {
        //Load script
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://x01x012013.github.io/AdBlockProtector/AdBlockProtector.user.js",
            synchronous: true,
            onload: function (response) {
                //(Workaround) Give main script access to GM_xmlhttpRequest
                exportFunction(toExport, unsafeWindow, { defineAs: "ABP_XHR", allowCrossOriginArguments: true });
                unsafeWindow.eval(response.responseText
                    .replace("(function () {", "(function () { const unsafeWindow = window; const GM_xmlhttpRequest = function(d){window.ABP_details = d; ABP_XHR();}; ")
                    .replace(/response\.responseText/g, "response")
                );
            },
            onerror: function () {
                alert("Could not load AdBlock Protector. ");
            }
        });
    } catch (err) {
        console.log(err);
    }
})()
