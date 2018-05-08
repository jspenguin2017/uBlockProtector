/**
 * Moat FreeWheel JSPEM surrogate.
 */
; (() => {
    "use strict";

    try {
        window.console.error("[Nano] Surrogate Injected :: FreeWheel SDK");
    } catch (err) { }

    window.MoatFreeWheelJSPEM = class {
        init() { }
        dispose() { }
    };
})();
