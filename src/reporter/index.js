/**
 * Script for quick issue reporter.
 */
"use strict";


/**
 * The key for local storage.
 * @const {string}
 */
const storageKey = "quick-issue-reporter-last-report";
/**
 * The time the user must wait between sending two messages.
 * @const {number}
 */
const rateLimit = 900000;
/**
 * The name of the host app.
 * @const {string}
 */
const appName = (() => {
    const manifest = chrome.runtime.getManifest();
    return manifest.name + " " + manifest.version;
});


$("#send").on("click", async () => {
    const category = $("#category").prop("value");
    const url = $("#url").prop("value");
    const details = $("#details").prop("value");

    if (!category) {
        $("#msg-specific-error p").text("You must choose a category.");
        $("#msg-specific-error").addClass("open");
        return;
    }
    if (!url) {
        $("#msg-specific-error p").text("You must fill the URL field.");
        $("#msg-specific-error").addClass("open");
        return;
    }
    if (details.length > 4096) {
        $("#msg-specific-error p").text("Additional details can be at most 4096 characters long.");
        $("#msg-specific-error").addClass("open");
        return;
    }

    let response
    try {
        response = await post(
            "send\n" +
            "Quick Issue Reporter\n" +
            navigator.userAgent + "\n" +
            appName + "\n" +
            "\n" +
            "[" + category + "] " + url + "\n" +
            details
        );
    } catch (e) {
        $("#msg-generic-error").addClass("open");
        return;
    }

    if (response === "ok") {
        localStorage.setItem(storageKey, Date.now());
        $("#msg-report-sent").addClass("open");
    } else {
        console.error(response);
        $("#msg-generic-error").addClass("open");
    }
});

$("#msg-generic-error button").on("click", () => {
    $("#msg-generic-error").rmClass("open");
});
$("#msg-specific-error button").on("click", () => {
    $("#msg-specific-error").rmClass("open");
});

(() => {
    const lastReport = localStorage.getItem(storageKey);
    const now = Date.now();
    if (typeof lastReport === "number" && lastReport + rateLimit > now) {
        $("#msg-rate-limited").addClass("open");
    } else {
        $("#main").rmClass("hidden");
    }
})();
