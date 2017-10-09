//This file contains content rules for debugging purposes, they are only activated in debug mode
"use strict";

//@pragma-if-debug

//Tools
if (a.debugMode) {
    if (a.domCmp(["twitch.tv"], true)) {
        //Force Twitch to show debug logs
        a.readOnly("log", "window.console.log.bind(window.console)", "window.console");
        a.readOnly("warn", "window.console.warn.bind(window.console)", "window.console");
        a.readOnly("error", "window.console.error.bind(window.console)", "window.console");
    }
}

//Rules
if (a.debugMode) {
    //No rules for now
}

//@pragma-end-if
