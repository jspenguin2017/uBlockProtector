/******************************************************************************

    Nano Defender - An anti-adblock defuser
    Copyright (C) 2016-2018  Nano Defender contributors

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

*******************************************************************************

    Content rules for debugging. Only run in debug mode.

******************************************************************************/

"use strict";

/*****************************************************************************/

//@pragma-if-debug

/*****************************************************************************/

// Tools

if (a.debugMode) {

    /*************************************************************************/

    if (a.domCmp(["twitch.tv"], true)) {
        // Force Twitch to show debug logs

        a.readOnly("log", "window.console.log.bind(window.console)", "window.console");
        a.readOnly("warn", "window.console.warn.bind(window.console)", "window.console");
        a.readOnly("error", "window.console.error.bind(window.console)", "window.console");
    }

    /*************************************************************************/

}

/*****************************************************************************/

// Rules

if (a.debugMode) {

    /*************************************************************************/

    // Partially working
    if (a.domCmp(["hulu.com"])) {
        const performClick = (btn) => {
            if (btn.classList.contains("nano-defender-clicked")) {
                return;
            }

            btn.classList.add("nano-defender-clicked");
            btn.click();

            // TODO
            console.warn("clicked", btn);
        };
        a.onInsert((node) => {
            if (node.querySelector) {
                if (node.classList.contains("ad-selector-option") || node.classList.contains("trailer-selector-watch-trailer-button")) {
                    setTimeout(performClick, 1000, node);
                } else {
                    const btn = node.querySelector(".ad-selector-option, .trailer-selector-watch-trailer-button");
                    if (btn) {
                        setTimeout(performClick, 1000, btn);
                    }
                }
            }
        });
    }

    /*************************************************************************/

    // https://github.com/NanoAdblocker/NanoFilters/issues/218
    if (a.domCmp(["di.fm", "jazzradio.com"])) {
        a.loopbackXHR((ignored, url) => {
            if (url.startsWith("https://pubads.g.doubleclick.net/")) {
                return `<?xml version="1.0" encoding="UTF-8"?>
<VAST xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="vast.xsd" version="3.0">
</VAST>`;
            }
        });
    }

    /*************************************************************************/

}

/*****************************************************************************/

//@pragma-end-if

/*****************************************************************************/
