"use strict";

/**
 * Check installation of uBlock Protector.
 * @function
 */
const checkInstallation = (() => {
    const $list = document.getElementById("list-test");
    const $ext = document.getElementById("extension-test");
    const $browser = document.getElementById("browser-test");

    const reExtractBrowserVersion = /Chrom(?:ium|e)\/(\d+)/;

    return () => {
        try {
            if (window.google_ad_status === 1) {
                $list.classList.add("hidden");
            }
        } catch (err) { }

        try {
            if (window.uBlock_Protector_Extension === true) {
                $ext.classList.add("hidden");
            }
        } catch (err) { }

        try {
            const version = parseInt(reExtractBrowserVersion.exec(navigator.userAgent)[1]);
            if (version >= 62) {
                $browser.classList.add("hidden");
            }
        } catch (err) { }
    };
})();

{
    const token = setInterval(checkInstallation, 1000);

    checkInstallation();

    setTimeout(() => {
        clearInterval(token);
    }, 30000);
}
