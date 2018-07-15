/**
 * Special content script for Edge.
 */
"use strict";

if (a.domCmp(["windowscentral.com"])) {
    a.noAccess("adonisHash");
    a.beforeScript((script) => {
        if (script.textContent && script.textContent.includes("adBlocker")) {
            script.remove();
        }
    });
}
