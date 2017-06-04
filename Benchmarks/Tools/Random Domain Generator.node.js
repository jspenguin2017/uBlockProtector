"use strict";

let a = [];

for (let i = 0; i < 200; i++) {
    a.push(Math.random().toString(36).substring(2));
    if (false) {
        a[i] += ".com";
    }
}

console.log(JSON.stringify(a));
