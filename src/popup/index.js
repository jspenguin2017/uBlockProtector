/**
 * Script for popup panel.
 */
"use strict";


/**
 * Home pages.
 * @const {Map}
 */
const home = [
    "",
    "https://jspenguin2017.github.io/uBlockProtector/",
    "https://github.com/jspenguin2017/uBlockProtector",
    chrome.runtime.getURL("/reporter/index.html"),
];

/**
 * On click handler.
 * @function
 * @listens click
 */
const onclick = function () {
    const url = home[this.dataset.home] + this.dataset.href;
    chrome.tabs.create({
        url: url,
    });
};


chrome.tabs.query({
    active: true,
    currentWindow: true,
}, (tabs) => {
    if (chrome.runtime.lastError || tabs.length === 0) {
        return;
    }
    home[3] += "?" + tabs[0].id;
});
$(".title > p").text("Nano Defender " + chrome.runtime.getManifest().version);
$(".wrapper").on("click", onclick);
