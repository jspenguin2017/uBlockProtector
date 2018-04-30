/**
 * Special background script for Chromium.
 */
"use strict";

{
    // https://github.com/jspenguin2017/uBlockProtector/issues/398
    // https://gitlab.com/xuhaiyang1234/NanoAdblockerSecretIssues/issues/12
    // https://github.com/AdguardTeam/AdguardFilters/issues/6718
    a.staticServer(
        [
            "*://ads-v-darwin.hulustream.com/published/*.mp4*",
            "*://*.ads-v-darwin.hulustream.com/published/*.mp4*",
        ],
        [
            "media",
        ],
        a.blankMP4,
        [
            "hulu.com",
        ],
        true,
    );
}
