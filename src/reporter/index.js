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


$("#send").on("click", () => {
    const category = $("#category").attr("value");
    const url = $("#url").attr("value");
    const details = $("#details").attr("value");

    debugger;
});
$("#msg-generic-error button").on("click", () => {
    $("#msg-generic-error").rmClass("open");
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
