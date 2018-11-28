/**
 * Background rules.
 */
"use strict";

a.init();
a.generic();

{
    // shorte.st and related domains
    // https://github.com/jspenguin2017/uBlockProtector/issues/169
    // https://github.com/NanoMeow/QuickReports/issues/333
    chrome.webRequest.onBeforeSendHeaders.addListener(
        (details) => {
            for (const header of details.requestHeaders) {
                if (header.name === "User-Agent")
                    header.value = "curl/7.47.0";
            }
            return { requestHeaders: details.requestHeaders };
        },
        {
            urls: [
                "*://shorte.st/*",
                "*://5k4i.com/*",
                "*://ceesty.com/*",
                "*://clkme.me/*",
                "*://clkmein.com/*",
                "*://cllkme.com/*",
                "*://corneey.com/*",
                "*://destyy.com/*",
                "*://festyy.com/*",
                "*://gestyy.com/*",
                "*://pj45.com/*",
                "*://sh.st/*",
                "*://viid.me/*",
                "*://wiid.me/*",
                "*://xiw34.com/*",
                "*://iklan.master-cyber.com/*",
                "*://links.orgasmatrix.com/*",
                "*://wik34.com/*",
                "*://zryydi.com/*",
                "*://skiip.me/*",
            ],
            types: [
                "main_frame",
                "sub_frame",
            ],
        },
        [
            "blocking",
            "requestHeaders",
        ],
    );
}
