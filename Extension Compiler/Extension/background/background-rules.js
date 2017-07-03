//Background rules
"use strict";

//Initialize
a.init();

//Issue: https://github.com/jspenguin2017/uBlockProtector/issues/344
/*
//Payload generator
console.log("data:text/javascript;base64," + btoa("(" + String(() => {
    "use strict";
    window.console.error("Uncaught Error: FreeWheel SDK is not allowed on this device!");
    window.MoatFreeWheelJSPEM = class {
        init() { }
        dispose() { }
    };
}) + ")();"));
*/
a.staticServer(
    [
        "https://*.moatads.com/*/MoatFreeWheelJSPEM.js",
    ],
    [
        "script",
    ],
    "data:text/javascript;base64,KCgpID0+IHsNCiAgICAidXNlIHN0cmljdCI7DQogICAgd2luZG93LmNvbnNvbGUuZXJyb3IoIlVuY2F1Z2h0IEVycm" +
    "9yOiBGcmVlV2hlZWwgU0RLIGlzIG5vdCBhbGxvd2VkIG9uIHRoaXMgZGV2aWNlISIpOw0KICAgIHdpbmRvdy5Nb2F0RnJlZVdoZWVsSlNQRU0gPSBjbGFz" +
    "cyB7DQogICAgICAgIGluaXQoKSB7IH0NCiAgICAgICAgZGlzcG9zZSgpIHsgfQ0KICAgIH07DQp9KSgpOw==",
);
