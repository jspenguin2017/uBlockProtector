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


$(".wrapper").on("click", onclick);
