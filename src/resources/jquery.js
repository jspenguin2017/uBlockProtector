/**
 * jQuery Anti-adblock plugin defuser.
 */
; (() => {
    "use strict";

    try {
        window.console.error("[Nano] Generic Solution Triggered :: jQuery Plugin");
    } catch (err) { }

    try {
        window.$.adblock = false;
    } catch (err) { }
    try {
        window.jQuery.adblock = false;
    } catch (err) { }
})();
