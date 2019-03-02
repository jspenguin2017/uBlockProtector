// ----------------------------------------------------------------------------------------------------------------- //

// Nano Defender - An anti-adblock defuser
// Copyright (C) 2016-2019  Nano Defender contributors
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

// ----------------------------------------------------------------------------------------------------------------- //

// Background rules for debugging
// Only run in debug mode

// ----------------------------------------------------------------------------------------------------------------- //

"use strict";

// ----------------------------------------------------------------------------------------------------------------- //

//@pragma-if-debug

// ----------------------------------------------------------------------------------------------------------------- //

// Tools

if (a.debugMode) {

    {
        // https://github.com/jspenguin2017/uBlockProtector/issues/338

        a.proxy(
            [
                "*://*.go.com/*",
                "*://go.com/*",
            ],
            "107.77.200.10",
        );
    }

    {
        // https://github.com/jspenguin2017/uBlockProtector/issues/286

        a.proxy(
            [
                "*://*.itv.com/*",
                "*://itv.com/*",
            ],
            "88.82.2.10",
        );
    }

    {
        // https://gitlab.com/xuhaiyang1234/NanoAdblockerSecretIssues/issues/10

        a.proxy(
            [
                "*://*.tvnow.de/*",
                "*://tvnow.de/*",
            ],
            "46.101.180.199",
        );
    }

    // a.proxy() does not work for:
    //     topserialy.to
    //     viasport.fi

}

// ----------------------------------------------------------------------------------------------------------------- //

// Rules

if (a.debugMode) {

    {
        // https://github.com/uBlockOrigin/uAssets/issues/772

        const reBlock = /^https?:\/\/(?:[^.]*?\.)?uplynk\.com\/api\/v3\/preplay\//;
        const reStrip = /^https?:\/\/(?:[^.]*?\.)?uplynk\.com\/ext\/[^?]*\.m3u8\?/;

        a.dynamicServer(
            [
                "*://*.uplynk.com/*",
                "*://uplynk.com/*",
            ],
            [
                "xmlhttprequest",
            ],
            (details) => {
                if (reBlock.test(details.url)) {
                    return { cancel: true };
                } else if (reStrip.test(details.url)) {
                    const i = details.url.indexOf('?');
                    return { redirectUrl: details.url.substring(0, i) };
                }
            },
        );
    }

    {
        // https://github.com/jspenguin2017/uBlockProtector/issues/1015

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
                    "*://5k4i.com/*",
                    "*://ceesty.com/*",
                    "*://clkme.me/*",
                    "*://clkmein.com/*",
                    "*://cllkme.com/*",
                    "*://corneey.com/*",
                    "*://destyy.com/*",
                    "*://festyy.com/*",
                    "*://gestyy.com/*",
                    "*://iklan.master-cyber.com/*",
                    "*://links.orgasmatrix.com/*",
                    "*://pj45.com/*",
                    "*://sh.st/*",
                    "*://shorte.st/*",
                    "*://skiip.me/*",
                    "*://viid.me/*",
                    "*://wiid.me/*",
                    "*://wik34.com/*",
                    "*://xiw34.com/*",
                    "*://zryydi.com/*",
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

}

// ----------------------------------------------------------------------------------------------------------------- //

//@pragma-end-if

// ----------------------------------------------------------------------------------------------------------------- //
