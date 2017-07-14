"use strict";

/**
 * Create anchor element from a link template.
 * @function
 * @param {string} link - The link.
 * @return {DOMString} The anchor element string.
 */
const template = (link) => `<a href="${link}" target="_blank">${link}</a>`;

//Replace link templates
const links = document.querySelectorAll("link-template");
for (let i = 0; i < links.length; i++) {
    const p = document.createElement("p");
    p.innerHTML = template(links[i].textContent);
    links[i].parentNode.replaceChild(p, links[i]);
}
