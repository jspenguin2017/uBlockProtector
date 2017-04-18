# AdBlock Protector

### Using

Installation instructions, along with many other relevant information are available on our website: http://jspenguin2017.github.io/AdBlockProtector/

### Building

We use custom compilers, the source code for the compilers along with prebuilt binaries are located in `Script Compiler` and `List Compiler` folders. 

The compilers are built with Visual Studio 2015. 

### License

Anti-Adblock Killer Script is completely re-implemented. 

Anti-Adblock Killer Filter is mostly copied and concatenated to List. Comments and [these](https://github.com/jspenguin2017/AdBlockProtector/blob/master/List%20Compiler/Remove.txt) are removed. 

Code from Anti-Adblock Killer inherits its original license: https://github.com/reek/anti-adblock-killer/blob/master/LICENSE

Unless otherwise specified, everything else (starting version 4.0) falls under GNU GPL v3 license. 

### To-do

1. `a.filter()` redesign, make matching has string mode, exact match mode, RegExp mode, and callback mode. Also fix craches when arguments are not `toString`-able. 
2. Remove `a()` and `a.VERSION`, they are used precisely 0 times. 
3. Add contribution guideline and other documentation for transparency and clarity. 
