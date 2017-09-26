//Proprietary scripts loader, only runs in debug mode
//This file should be emptied by the compiler before uploading to Web Store
//
// ===== MUST READ ===== MUST READ ===== MUST READ ===== MUST READ ===== MUST READ ===== MUST READ =====
// I highly recommend you to stop visiting these websites over using these proprietary solutions
// If you still want to use them, load uBlock Protector Extension is debug mode and they will run
//
// You may need to refresh the page a couple times for the file to be properly cached
// Also try to clear cookies by clicking on the green padlock near the address bar, then the link below
// "Cookies", then the button "Remove", DO NOT use the console
//
// DO NOT open the console, DO NOT request the files manually, and ONLY use latest Chromium or Chrome
// browser
// Your IP might be temporarily banned if you attempt to reverse engineer these solutions, and they
// will not work while your IP is banned
// ===== MUST READ ===== MUST READ ===== MUST READ ===== MUST READ ===== MUST READ ===== MUST READ =====
//
"use strict";

if (a.debugMode) {
    if (a.isTopFrame && a.domCmp(["lolalytics.com"])) {
        //https://github.com/AdguardTeam/AdguardFilters/issues/6280
        //https://github.com/AdguardTeam/AdguardFilters/issues/6576
        //https://github.com/uBlockOrigin/uAssets/issues/668
        const script = document.createElement("script");
        script.src = "https://jspenguin.com/API/uBlockProtector/Proprietary/lolalytics_com.js?v1.1";
        script.charset = "utf-8";
        document.documentElement.appendChild(script);
    }
    if (a.isTopFrame && a.domCmp(["socketloop.com"])) {
        //https://github.com/AdguardTeam/AdguardFilters/issues/6905
        const script = document.createElement("script");
        script.src = "https://jspenguin.com/API/uBlockProtector/Proprietary/socketloop_com.js?v1.0";
        script.charset = "utf-8";
        document.documentElement.appendChild(script);        
    }
}
