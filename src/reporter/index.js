// ----------------------------------------------------------------------------------------------------------------- //

// Nano Defender - An anti-adblock defuser
// Copyright (C) 2016-2019  Nano Defender contributors
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

// ----------------------------------------------------------------------------------------------------------------- //

// Script for quick issue reporter

// ----------------------------------------------------------------------------------------------------------------- //

"use strict";

// ----------------------------------------------------------------------------------------------------------------- //

const knownGood = [
    // Wrong page
    "addons.mozilla.org",
    "chrome.google.com",
    "hugoxu.com",
    "github.com",
    "jspenguin2017.github.io",
    "www.microsoft.com", // Do not remove "www"

    // Bad installation
    "blockadblock.com",
    "detectadblock.com",

    // Broken by non-default ABP X Files
    "hdblog.it",

    // Broken by Firefox Tracking Protection
    "bild.de",

    // Other known good
    "youtube.com",
];

const knownBad = [
    // https://github.com/NanoMeow/QuickReports/issues/903
    "browserleaks.com",

    // https://github.com/NanoMeow/QuickReports/issues/1711
    "o2.pl",

    // https://github.com/NanoMeow/QuickReports/issues/1760
    "wp.pl",
];

// ----------------------------------------------------------------------------------------------------------------- //

let initialUrl = "";

// ----------------------------------------------------------------------------------------------------------------- //

const lastReportStorageKey = "quick-issue-reporter-last-report";
const bugReportDomainSuffix = "-nanobugreport.hugoxu.com";

const reportsRateLimit = 900000; // 15 minutes
const detailsLengthLimit = 3072;

const updateDetailsLengthDisplay = () => {
    const length = $("#details").prop("value").length;

    $("#character-count").text(length.toString() + "/" + detailsLengthLimit.toString());

    if (length > detailsLengthLimit)
        $("#character-count").addClass("red");
    else
        $("#character-count").rmClass("red");
};

// ----------------------------------------------------------------------------------------------------------------- //

const appName = (() => {
    const manifest = chrome.runtime.getManifest();
    return manifest.name + " " + manifest.version;
})();

const showMessage = (msg) => {
    $("#msg-specific-error p").html(msg);
    $("#msg-specific-error").addClass("open");
};

const domCmp = (domain, matchers) => {
    if (domain.endsWith(bugReportDomainSuffix))
        return false;

    for (const d of matchers) {
        if (domain.endsWith(d) && (domain.length === d.length || domain.charAt(domain.length - d.length - 1) === "."))
            return true;
    }
    return false;
};

const randId = () => {
    const r = Math.random();
    return r.toString(16).substring(2);
};

// ----------------------------------------------------------------------------------------------------------------- //

$("#category").on("change", function () {
    if (this.value === "Ads") {
        showMessage(
            "For missed ads and popups, please report to the <a href='https://forums.lanik.us/'>EasyList Forum</a> " +
            "first.",
        );
    }

    if (this.value === "Bug")
        $("#url").prop("value", "https://" + randId() + bugReportDomainSuffix + "/").attr("disabled", "");
    else
        $("#url").prop("value", initialUrl).rmAttr("disabled");
});

$("#details").on("input", updateDetailsLengthDisplay);
updateDetailsLengthDisplay();

$("#send").on("click", async () => {
    const category = $("#category").prop("value");
    const url = $("#url").prop("value").trim();
    const details = $("#details").prop("value");

    if (!category)
        return void showMessage("Please select an issue type.");

    let domain = /^https?:\/\/([^/]+)/.exec(url);
    if (!domain)
        return void showMessage("Please enter a valid URL.");

    domain = domain[1];
    if (domCmp(domain, knownGood))
        return void $("#msg-known-good").addClass("open");
    if (domCmp(domain, knownBad))
        return void $("#msg-known-bad").addClass("open");

    if (category === "Other" && details.length < 10) {
        return void showMessage(
            "Please add a quick explanation for the &quot;Other issue&quot; category that you have chosen " +
            "(minimum 10 characters).",
        );
    }
    if (category === "Bug" && details.length < 100) {
        return void showMessage(
            "Please incude a detailed step-by-step reproduction guide for this issue (minimum 100 characters).",
        );
    }

    if (details.length > detailsLengthLimit) {
        return void showMessage(
            "Additional details can be at most " + detailsLengthLimit.toString() + " characters long.",
        );
    }

    const payload = [
        "send",
        "Quick Issue Reporter",
        navigator.userAgent,
        appName,
        "",
        "[" + category + "] " + url,
        "",
    ];
    if (url !== initialUrl) {
        payload.push(
            "Original URL: `" + initialUrl + "`",
            "",
        );
    }
    payload.push(details);

    let response;
    try {
        response = await post(payload.join("\n"));
    } catch (err) {
        return void $("#msg-generic-error").addClass("open");
    }

    if (response === "ok") {
        localStorage.setItem(lastReportStorageKey, Date.now());
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

// ----------------------------------------------------------------------------------------------------------------- //

const init = () => {
    let lastReport = localStorage.getItem(lastReportStorageKey);

    // Maximum accuracy of integer is about 16 digits
    // Cap at 15 digits to be safe, which is still more than enough to represent the next 30 thousand years
    if (/^\d{13,15}$/.test(lastReport))
        lastReport = parseInt(lastReport);

    const now = Date.now();
    if (typeof lastReport === "number" && lastReport + reportsRateLimit > now)
        $("#msg-rate-limited").addClass("open");
    else
        $("#main").rmClass("hidden");
};

if (/^\?\d{1,15}$/.test(location.search)) {
    chrome.tabs.get(parseInt(location.search.substring(1)), (tab) => {
        if (!chrome.runtime.lastError) {
            initialUrl = tab.url;
            if ($("#url").prop("value").trim() === "")
                $("#url").prop("value", tab.url);
        }

        init();
    });
} else {
    init();
}

// ----------------------------------------------------------------------------------------------------------------- //
