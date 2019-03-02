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

// Special background script for Firefox

// ----------------------------------------------------------------------------------------------------------------- //

"use strict";

// ----------------------------------------------------------------------------------------------------------------- //

//@pragma-if-debug

// Debug rules

if (a.debugMode) {

    {
        // https://github.com/uBlockOrigin/uAssets/issues/772

        a.dynamicServer(
            [
                "*://*.uplynk.com/preplay/*",
            ],
            [
                "xmlhttprequest",
            ],
            (details) => {
                let payload = "";

                const filter = browser.webRequest.filterResponseData(details.requestId);
                const decoder = new TextDecoder("utf-8");
                const encoder = new TextEncoder();

                filter.ondata = (e) => {
                    payload += decoder.decode(e.data, { stream: true });
                };
                filter.onstop = () => {
                    try {
                        payload = JSON.parse(payload);
                    } catch (err) {
                        filter.write(encoder.encode(payload));
                        filter.disconnect();
                        return;
                    }

                    // Debug log
                    console.log(payload.ads);

                    payload.ads = {
                        breakOffsets: [],
                        breaks: [],
                        placeholderOffsets: [],
                    };

                    filter.write(encoder.encode(JSON.stringify(payload)));
                    filter.disconnect();
                };
            },
            [
                "fox.com",
            ],
            true,
        );
    }

}

//@pragma-end-if

// ----------------------------------------------------------------------------------------------------------------- //
