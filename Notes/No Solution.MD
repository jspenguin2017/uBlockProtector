# These are the issues where no solution is found

## viasatsport.fi

`Geo Lock (Finland)`

Test links: 
* http://www.viasport.fi/urheilu/jalkapallo/uutiset/suomi-liechtenstein-1-0
* http://www.viasport.fi/urheilu/jalkapallo/uutiset/suomi-liechtenstein

Issues: 
* https://github.com/jspenguin2017/uBlockProtector/issues/88

Workaround: In debug mode, the whole webpage will be replaced by a player which plays the first video on the page. 

## itv.com

`Account Required` `Geo Lock (United Kingdom)`

Test links: 
* https://www.itv.com/hub/take-me-out/1a8716a0086
* https://www.itv.com/hub/a-touch-of-frost/Ya1774a0037

Issues: 
* https://github.com/jspenguin2017/uBlockProtector/issues/286

Notes: 
* Not confirmed on the standard configuration, but since we do not have a solution for it, 
 chances are it does affect the standard configuration. 

Workaround: Add the filters below, you will see some ads. 
```
||spike.itv.com/itv/tserver/size=*/viewid=$badfilter
||tom.itv.com/itv/tserver/size=*/viewid=$badfilter
```
