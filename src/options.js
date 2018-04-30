/**
 * The script for options UI, replaces some elements and binds Esc key to
 * close.
 */
"use strict";


/**
 * Create an anchor element from a link.
 * @function
 * @param {string} link - The link.
 * @return {HTMLElement} The anchor element.
 */
const template = (link) => {
    let anchor = document.createElement("a");
    anchor.href = link;
    anchor.target = "_blank";
    anchor.textContent = link;
    return anchor;
};


const links = document.querySelectorAll("link-template");
for (let i = 0; i < links.length; i++) {
    const p = document.createElement("p");
    p.appendChild(template(links[i].textContent.trim()));
    links[i].parentNode.replaceChild(p, links[i]);
}

window.onkeyup = (e) => {
    if (e.keyCode === 27) { //Esc
        window.close();
    }
};

if (typeof elib === "object") {
    document.body.style.margin = "auto";
}
