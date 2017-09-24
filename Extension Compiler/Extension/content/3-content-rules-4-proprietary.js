//Proprietary scripts loader, only runs in debug mode
//This file should be emptied by the compiler before uploading to Web Store
"use strict";

if (a.debugMode) {
    if (a.domCmp(["lolalytics.com"])) {
        //https://github.com/AdguardTeam/AdguardFilters/issues/6280
        //https://github.com/AdguardTeam/AdguardFilters/issues/6576
        //https://github.com/uBlockOrigin/uAssets/issues/668
        const script = document.createElement("script");
        script.src = "https://jspenguin.com/API/uBlockProtector/Proprietary/lolalytics_com.js?v1.1";
        script.charset = "utf-8";
        document.documentElement.appendChild(script);
    }
}
