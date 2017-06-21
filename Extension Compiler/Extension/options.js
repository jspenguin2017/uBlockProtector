"use strict";

/**
 * The checkbox element and the error message element.
 * @const {HTMLInputElement}
 */
const cb = document.getElementById("checkbox");
const error = document.getElementById("error");
/**
 * Whether the last changed is saved.
 * @var {boolean}
 */
let ready = true;
/**
 * Unlock the UI if it is ready.
 * @function
 */
const unlock = () => {
    if (ready) {
        cb.disabled = false;
    } else {
        setTimeout(unlock, 1000);
    }
};

//Load settings
chrome.storage.sync.get("option", (data) => {
    if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        error.textContent = "Could not load options.";
        error.style.display = "block";
    } else {
        cb.checked = data["option"] === true;
        cb.disabled = false;
    }
});
//Listen to state change event
cb.addEventListener("change", () => {
    ready = false;
    //Lock the checkbox
    cb.disabled = true;
    //Save changes
    chrome.storage.sync.set({ option: cb.checked }, () => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            error.textContent = "Could not save changes.";
            error.style.display = "block";
        } else {
            //Tell background page
            chrome.runtime.sendMessage({ cmd: "update option", data: cb.checked }, (err) => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                    error.textContent = "Could not update cache.";
                    error.style.display = "block";
                } else if (err) {
                    error.textContent = err;
                    error.style.display = "block";
                } else {
                    ready = true;
                }
            });
        }
    });
    //Set a timer to unlock the checkbox, I will not unlock it as soon as I can because the storage
    //has a rate limit
    setTimeout(unlock, 1000);
});
