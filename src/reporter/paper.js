/**
 * Paper library.
 */
"use strict";

/**
 * Toggle wait screen.
 * @function
 */
const wait = (() => {
    const $popup = document.getElementById("paper-wait");

    let state = false;
    return () => {
        if (state) {
            $popup.classList.remove("open");
        } else {
            $popup.classList.add("open");
        }

        state = !state;
    };
})();

/**
 * Send a POST request to the standard API endpoint.
 * @async @function
 * @param {string} payload - The payload to send.
 * @return {string} The response text when successful.
 * @throws {XMLHttpRequest} The XMLHttpRequest instance when not successful.
 */
const post = (payload) => {
    return new Promise((resolve, reject) => {
        wait();

        let req = new XMLHttpRequest();

        req.onreadystatechange = () => {
            if (req.readyState === XMLHttpRequest.DONE) {
                wait();

                if (req.status === 200) {
                    resolve(req.responseText);
                } else {
                    reject(req);
                }
            }
        };

        req.open("POST", "https://legacy.hugoxu.com/PrivateMessage/Report.php");
        req.send(payload);
    });
};
