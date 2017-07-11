# These are the issues where no solution is found

## viasatsport.se, viasport.fi, tv3sport.dk, viasport.no

`Geo Lock (Sweden)` `Geo Lock (Finland)` `Geo Lock (Danmark)` `Geo Lock (Norway)`

Test links: 
* http://www.viasport.fi/urheilu/jalkapallo/uutiset/suomi-liechtenstein-1-0
* http://www.viasport.fi/urheilu/jalkapallo/uutiset/suomi-liechtenstein
* https://www.tv3sport.dk/sport/tennis/nyheder/lettet-wozniacki-jeg-var-halvvejs-pa-vej-hjem

Issues: 
* https://github.com/jspenguin2017/uBlockProtector/issues/88
* https://github.com/jspenguin2017/uBlockProtector/issues/359

Workaround (may break some player functionalities): 
```
@@||fwmrm.net^$domain=viasatsport.se|viasport.fi|tv3sport.dk|viasport.no
||freewheel-mtgx-tv.akamaized.net^$media,domain=viasatsport.se|viasport.fi|tv3sport.dk|viasport.no
||fwmrm.net^$image,important,domain=viasatsport.se|viasport.fi|tv3sport.dk|viasport.no
||fwmrm.net/ad/*$xmlhttprequest,important,redirect=nooptext,domain=viasatsport.se|viasport.fi|tv3sport.dk|viasport.no
```

## itv.com

`Geo Lock (United Kingdom)`

Test links: 
* https://www.itv.com/hub/take-me-out/1a8716a0049

Issues: 
* https://github.com/jspenguin2017/uBlockProtector/issues/286

Workaround (may show some ads): 
```
||tom.itv.com/itv/tserver/size=*/viewid=$badfilter
```
