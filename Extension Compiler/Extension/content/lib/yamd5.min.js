// project home: https://github.com/gorhill/yamd5.js
// minified using http://refresh-sf.com/yui/
;(function(g){var b=function(l,n){var m=l[0],j=l[1],p=l[2],o=l[3];m+=(j&p|~j&o)+n[0]-680876936|0;m=(m<<7|m>>>25)+j|0;o+=(m&j|~m&p)+n[1]-389564586|0;
o=(o<<12|o>>>20)+m|0;p+=(o&m|~o&j)+n[2]+606105819|0;p=(p<<17|p>>>15)+o|0;j+=(p&o|~p&m)+n[3]-1044525330|0;j=(j<<22|j>>>10)+p|0;
m+=(j&p|~j&o)+n[4]-176418897|0;m=(m<<7|m>>>25)+j|0;o+=(m&j|~m&p)+n[5]+1200080426|0;o=(o<<12|o>>>20)+m|0;p+=(o&m|~o&j)+n[6]-1473231341|0;
p=(p<<17|p>>>15)+o|0;j+=(p&o|~p&m)+n[7]-45705983|0;j=(j<<22|j>>>10)+p|0;m+=(j&p|~j&o)+n[8]+1770035416|0;m=(m<<7|m>>>25)+j|0;
o+=(m&j|~m&p)+n[9]-1958414417|0;o=(o<<12|o>>>20)+m|0;p+=(o&m|~o&j)+n[10]-42063|0;p=(p<<17|p>>>15)+o|0;j+=(p&o|~p&m)+n[11]-1990404162|0;
j=(j<<22|j>>>10)+p|0;m+=(j&p|~j&o)+n[12]+1804603682|0;m=(m<<7|m>>>25)+j|0;o+=(m&j|~m&p)+n[13]-40341101|0;o=(o<<12|o>>>20)+m|0;
p+=(o&m|~o&j)+n[14]-1502002290|0;p=(p<<17|p>>>15)+o|0;j+=(p&o|~p&m)+n[15]+1236535329|0;j=(j<<22|j>>>10)+p|0;m+=(j&o|p&~o)+n[1]-165796510|0;
m=(m<<5|m>>>27)+j|0;o+=(m&p|j&~p)+n[6]-1069501632|0;o=(o<<9|o>>>23)+m|0;p+=(o&j|m&~j)+n[11]+643717713|0;p=(p<<14|p>>>18)+o|0;
j+=(p&m|o&~m)+n[0]-373897302|0;j=(j<<20|j>>>12)+p|0;m+=(j&o|p&~o)+n[5]-701558691|0;m=(m<<5|m>>>27)+j|0;o+=(m&p|j&~p)+n[10]+38016083|0;
o=(o<<9|o>>>23)+m|0;p+=(o&j|m&~j)+n[15]-660478335|0;p=(p<<14|p>>>18)+o|0;j+=(p&m|o&~m)+n[4]-405537848|0;j=(j<<20|j>>>12)+p|0;
m+=(j&o|p&~o)+n[9]+568446438|0;m=(m<<5|m>>>27)+j|0;o+=(m&p|j&~p)+n[14]-1019803690|0;o=(o<<9|o>>>23)+m|0;p+=(o&j|m&~j)+n[3]-187363961|0;
p=(p<<14|p>>>18)+o|0;j+=(p&m|o&~m)+n[8]+1163531501|0;j=(j<<20|j>>>12)+p|0;m+=(j&o|p&~o)+n[13]-1444681467|0;m=(m<<5|m>>>27)+j|0;
o+=(m&p|j&~p)+n[2]-51403784|0;o=(o<<9|o>>>23)+m|0;p+=(o&j|m&~j)+n[7]+1735328473|0;p=(p<<14|p>>>18)+o|0;j+=(p&m|o&~m)+n[12]-1926607734|0;
j=(j<<20|j>>>12)+p|0;m+=(j^p^o)+n[5]-378558|0;m=(m<<4|m>>>28)+j|0;o+=(m^j^p)+n[8]-2022574463|0;o=(o<<11|o>>>21)+m|0;p+=(o^m^j)+n[11]+1839030562|0;
p=(p<<16|p>>>16)+o|0;j+=(p^o^m)+n[14]-35309556|0;j=(j<<23|j>>>9)+p|0;m+=(j^p^o)+n[1]-1530992060|0;m=(m<<4|m>>>28)+j|0;o+=(m^j^p)+n[4]+1272893353|0;
o=(o<<11|o>>>21)+m|0;p+=(o^m^j)+n[7]-155497632|0;p=(p<<16|p>>>16)+o|0;j+=(p^o^m)+n[10]-1094730640|0;j=(j<<23|j>>>9)+p|0;m+=(j^p^o)+n[13]+681279174|0;
m=(m<<4|m>>>28)+j|0;o+=(m^j^p)+n[0]-358537222|0;o=(o<<11|o>>>21)+m|0;p+=(o^m^j)+n[3]-722521979|0;p=(p<<16|p>>>16)+o|0;j+=(p^o^m)+n[6]+76029189|0;
j=(j<<23|j>>>9)+p|0;m+=(j^p^o)+n[9]-640364487|0;m=(m<<4|m>>>28)+j|0;o+=(m^j^p)+n[12]-421815835|0;o=(o<<11|o>>>21)+m|0;p+=(o^m^j)+n[15]+530742520|0;
p=(p<<16|p>>>16)+o|0;j+=(p^o^m)+n[2]-995338651|0;j=(j<<23|j>>>9)+p|0;m+=(p^(j|~o))+n[0]-198630844|0;m=(m<<6|m>>>26)+j|0;o+=(j^(m|~p))+n[7]+1126891415|0;
o=(o<<10|o>>>22)+m|0;p+=(m^(o|~j))+n[14]-1416354905|0;p=(p<<15|p>>>17)+o|0;j+=(o^(p|~m))+n[5]-57434055|0;j=(j<<21|j>>>11)+p|0;
m+=(p^(j|~o))+n[12]+1700485571|0;m=(m<<6|m>>>26)+j|0;o+=(j^(m|~p))+n[3]-1894986606|0;o=(o<<10|o>>>22)+m|0;p+=(m^(o|~j))+n[10]-1051523|0;
p=(p<<15|p>>>17)+o|0;j+=(o^(p|~m))+n[1]-2054922799|0;j=(j<<21|j>>>11)+p|0;m+=(p^(j|~o))+n[8]+1873313359|0;m=(m<<6|m>>>26)+j|0;
o+=(j^(m|~p))+n[15]-30611744|0;o=(o<<10|o>>>22)+m|0;p+=(m^(o|~j))+n[6]-1560198380|0;p=(p<<15|p>>>17)+o|0;j+=(o^(p|~m))+n[13]+1309151649|0;
j=(j<<21|j>>>11)+p|0;m+=(p^(j|~o))+n[4]-145523070|0;m=(m<<6|m>>>26)+j|0;o+=(j^(m|~p))+n[11]-1120210379|0;o=(o<<10|o>>>22)+m|0;
p+=(m^(o|~j))+n[2]+718787259|0;p=(p<<15|p>>>17)+o|0;j+=(o^(p|~m))+n[9]-343485551|0;j=(j<<21|j>>>11)+p|0;l[0]=m+l[0]|0;l[1]=j+l[1]|0;
l[2]=p+l[2]|0;l[3]=o+l[3]|0};var e="0123456789abcdef";var d=[];var c=function(k){var q=e;var o=d;var r,p,l;for(var m=0;m<4;
m++){p=m*8;r=k[m];for(l=0;l<8;l+=2){o[p+1+l]=q.charAt(r&15);r>>>=4;o[p+0+l]=q.charAt(r&15);r>>>=4}}return o.join("")};var i=function(){this._dataLength=0;
this._state=new Int32Array(4);this._buffer=new ArrayBuffer(68);this._bufferLength=0;this._buffer8=new Uint8Array(this._buffer,0,68);
this._buffer32=new Uint32Array(this._buffer,0,17);this.start()};var a=new Int32Array([1732584193,-271733879,-1732584194,271733878]);
var h=new Int32Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);i.prototype.appendStr=function(n){var k=this._buffer8;var j=this._buffer32;
var o=this._bufferLength;var m;for(var l=0;l<n.length;l++){m=n.charCodeAt(l);if(m<128){k[o++]=m}else{if(m<2048){k[o++]=(m>>>6)+192;
k[o++]=m&63|128}else{if(m<55296||m>56319){k[o++]=(m>>>12)+224;k[o++]=(m>>>6&63)|128;k[o++]=(m&63)|128}else{m=((m-55296)*1024)+(n.charCodeAt(++l)-56320)+65536;
if(m>1114111){throw"Unicode standard supports code points up to U+10FFFF"}k[o++]=(m>>>18)+240;k[o++]=(m>>>12&63)|128;k[o++]=(m>>>6&63)|128;
k[o++]=(m&63)|128}}}if(o>=64){this._dataLength+=64;b(this._state,j);o-=64;j[0]=j[16]}}this._bufferLength=o;return this};i.prototype.appendAsciiStr=function(o){var l=this._buffer8;
var k=this._buffer32;var p=this._bufferLength;var n,m=0;for(;;){n=Math.min(o.length-m,64-p);while(n--){l[p++]=o.charCodeAt(m++)
}if(p<64){break}this._dataLength+=64;b(this._state,k);p=0}this._bufferLength=p;return this};i.prototype.appendByteArray=function(m){var l=this._buffer8;
var k=this._buffer32;var p=this._bufferLength;var o,n=0;for(;;){o=Math.min(m.length-n,64-p);while(o--){l[p++]=m[n++]}if(p<64){break
}this._dataLength+=64;b(this._state,k);p=0}this._bufferLength=p;return this};i.prototype.start=function(){this._dataLength=0;
this._bufferLength=0;this._state.set(a);return this};i.prototype.end=function(p){var q=this._bufferLength;this._dataLength+=q;
var r=this._buffer8;r[q]=128;r[q+1]=r[q+2]=r[q+3]=0;var k=this._buffer32;var m=(q>>2)+1;k.set(h.subarray(m),m);if(q>55){b(this._state,k);
k.set(h)}var j=this._dataLength*8;if(j<=4294967295){k[14]=j}else{var n=j.toString(16).match(/(.*?)(.{0,8})$/);var o=parseInt(n[2],16);
var l=parseInt(n[1],16)||0;k[14]=o;k[15]=l}b(this._state,k);return !!p?this._state:c(this._state)};var f=new i();i.hashStr=function(k,j){return f.start().appendStr(k).end(j)
};i.hashAsciiStr=function(k,j){return f.start().appendAsciiStr(k).end(j)};if(i.hashStr("hello")!=="5d41402abc4b2a76b9719d911017c592"){console.error("YaMD5> this javascript engine does not support YaMD5. Sorry.")
}if(typeof g==="object"){g.YaMD5=i}return i})(this);