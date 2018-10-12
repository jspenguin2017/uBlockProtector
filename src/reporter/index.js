/**
 * Script for quick issue reporter.
 */
"use strict";


/**
 * The key for local storage.
 * @const {string}
 */
const storageKeyLastReport = "quick-issue-reporter-last-report";
/**
 * The time in milliseconds the user must wait between sending two messages.
 * @const {number}
 */
const rateLimit = 900000;

/**
 * The number of characters the details field can contain.
 * @const {number}
 */
const detailsLimit = 3072;
/**
 * Update the character count.
 * @function
 * @listens input
 */
const updateDetailsLimit = () => {
    const length = $("#details").prop("value").length;

    $("#character-count").text(
        length.toString() + "/" + detailsLimit.toString(),
    );

    if (length > detailsLimit) {
        $("#character-count").addClass("red");
    } else {
        $("#character-count").rmClass("red");
    }
};

/**
 * The name and version of the host app.
 * @const {string}
 */
const appName = (() => {
    const manifest = chrome.runtime.getManifest();
    return manifest.name + " " + manifest.version;
})();
/**
 * Show a specific error message.
 * @function
 * @param {DOMString} msg - The message to show
 */
const showMessage = (msg) => {
    $("#msg-specific-error p").html(msg);
    $("#msg-specific-error").addClass("open");
};

/**
 * Domains that are known to be working as intended.
 * @const {Array.<string>}
 */
const knownGood = [
    // Wrong page
    "addons.mozilla.org",
    "chrome.google.com",
    "github.com",
    "jspenguin.com",
    "jspenguin2017.github.io",
    "www.microsoft.com", // Do not remove "www"

    // Bad installation
    "blockadblock.com",

    // Broken by non-default ABP X Files
    "hdblog.it",

    // Broken by Firefox Tracking Protection
    "bild.de",

    // Fixed in regional filters
    "dn.se",
    "kwejk.pl",
    "onet.pl",
    "tvp.pl",
    "visioncloud.rocks",
    "wp.pl",
];
/**
 * Domains that are known to be bad where only technical help is needed.
 * @const {Array.<string>}
 */
const knownBad = [
    "kissanime.ru",
    "kissmanga.com",
    "twitch.tv",
];
/**
 * Check if a domain matches one of the matchers.
 * @param {string} domain - The domain to test.
 * @param {Array.<string>} matchers - The matchers.
 * @return {boolean} True if the domain matches, false otherwise.
 */
const domCmp = (domain, matchers) => {
    for (const d of matchers) {
        if (
            domain.endsWith(d) &&
            (
                domain.length === d.length ||
                domain.charAt(domain.length - d.length - 1) === '.'
            )
        ) {
            return true;
        }
    }
    return false;
};


$("#category").on("change", function () {
    if (this.value === "Ads") {
        showMessage("For missed ads and popups, please try the " +
            "<a href='https://forums.lanik.us/'>EasyList Forum</a> first.");
    }
});

$("#details").on("input", updateDetailsLimit);
updateDetailsLimit();

$("#send").on("click", async () => {
    const category = $("#category").prop("value");
    const url = $("#url").prop("value").trim();
    const details = $("#details").prop("value");

    if (!category) {
        showMessage("Please select an issue type.");
        return;
    }

    let domain = /^https?:\/\/([^/]+)/.exec(url);
    if (!domain) {
        showMessage("Please enter a valid URL.");
        return;
    }
    domain = domain[1];
    if (domCmp(domain, knownGood)) {
        $("#msg-known-good").addClass("open");
        return;
    }
    if (domCmp(domain, knownBad)) {
        $("#msg-known-bad").addClass("open");
        return;
    }

    if (category === "Other" && details.length < 5) {
        showMessage("Please add a quick explanation for the " +
            "&quot;Other&quot; category that you have chosen.");
        return;
    }
    if (details.length > detailsLimit) {
        showMessage("Additional details can be at most " +
            detailsLimit.toString() + " characters long.");
        return;
    }

    let response;
    try {
        response = await post(
            "send\n" +
            "Quick Issue Reporter\n" +
            navigator.userAgent + "\n" +
            appName + "\n" +
            "\n" +
            "[" + category + "] " + url + "\n" +
            "\n" +
            details
        );
    } catch (e) {
        $("#msg-generic-error").addClass("open");
        return;
    }

    if (response === "ok") {
        localStorage.setItem(storageKeyLastReport, Date.now());
        $("#msg-report-sent").addClass("open");
        $("#main").addClass("hidden");
    } else {
        console.error(response);
        $("#msg-generic-error").addClass("open");
    }
});

$(".popup-container button.float-right").on("click", function () {
    this.parentNode.parentNode.classList.remove("open");
});

{
    const init = () => {
        let lastReport = localStorage.getItem(storageKeyLastReport);
        // Maximum accuracy of integer is about 16 digits
        // Cap at 15 digits to be safe, which is still more than enough to
        // represent the next 30 thousand years
        if (/^\d{13,15}$/.test(lastReport)) {
            lastReport = parseInt(lastReport);
        }

        const now = Date.now();
        if (typeof lastReport === "number" && lastReport + rateLimit > now) {
            $("#msg-rate-limited").addClass("open");
        } else {
            $("#main").rmClass("hidden");
        }
    };

    if (/^\?\d{1,15}$/.test(location.search)) {
        chrome.tabs.get(parseInt(location.search.substring(1)), (tab) => {
            if (!chrome.runtime.lastError) {
                $("#url").prop("value", tab.url);
            }

            init();
        });
    } else {
        init();
    }
}
