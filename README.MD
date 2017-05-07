# AdBlock Protector

Installation instructions, along with many other relevant information are available on [our website](http://jspenguin2017.github.io/AdBlockProtector/). 

## Building

We use custom compilers, the source code for the compilers along with prebuilt binaries for Windows 10 are located in `Script Compiler` and `List Compiler` folders. 

The compilers are built with Visual Studio 2017. 

## License

Anti-Adblock Killer Script is completely re-implemented. 

Anti-Adblock Killer Filter is mostly copied and concatenated to List. Comments and [these](../master/List%20Compiler/Remove.txt) are removed. 

Code from Anti-Adblock Killer inherits its original [license](https://github.com/reek/anti-adblock-killer/blob/master/LICENSE). 

This project was completely redesigned on version 4.0, but the name of the project was kept. This was also when the license changed to GNU GPL v3. Files that are not from Anti-Adblock Killer falls under this license unless otherwise specified. 

## To-do

1. Next round optimizations: 
    * `a.filter()` redesign, make matching has string mode, exact match mode, RegExp mode, and callback mode. 
    * Remove `a()` and `a.VERSION`, they are used precisely 0 times. Put `jQueryFactory` and `jQueryColorLoader` to `a` namespace. 
    * Other general Core optimization and clean up. 
2. Add contribution guideline and other documentation for transparency and clarity. 
3. Add license awareness to List Compiler. 
4. Redesign Core functions that patches properties, they needs to be able to handle properties that are arbitrarily deep. 
5. Grant cross origin XHR on install time. 
