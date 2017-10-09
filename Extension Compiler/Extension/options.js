//Script for the options UI
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

//Replace link templates
const links = document.querySelectorAll("link-template");
for (let i = 0; i < links.length; i++) {
    const p = document.createElement("p");
    p.appendChild(template(links[i].textContent));
    links[i].parentNode.replaceChild(p, links[i]);
}
