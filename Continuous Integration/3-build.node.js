//Build and publish the new version
"use strict";

console.log("=====3-build.node.js starts=====");

//Test what will be covered to [secure]
//This is just a random string: 2Xnr9OWK9sxtVJpBr2GjD5eUxjr2p1XEYaXRUt2zolVXkt7iXJ3wMaqt99EPilFD3QOMNfsXeiDlFB5T7YRwAmIa49WrhIkmM1ChBthIhYX9Qs6TOtcNa7sMXTOi39PuFerDeRUYrBRl
console.log(process.env.SECRET);
console.log(`[${process.eng.SECRET}]`);
console.log(`"${process.eng.SECRET}"`);
console.log(new Error(process.eng.SECRET));

console.log("=====3-build.node.js ends=====");
