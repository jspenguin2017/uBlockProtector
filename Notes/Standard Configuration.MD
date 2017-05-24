### The standard configuration

This is the standard configuration, we will use this configuration for all our tests. 
We may not fix issues that we cannot reproduce and we may not accept solutions that fails in our tests. 

#### Everything updated to the latest stable version

#### Chrome: 

Settings under `Privacy -> Content settings...`, `Network`, and `HTTPS/SSL` are left as default. 

`Privacy -> Send a "Do Not Track" request with your browsing traffic` enabled. 

`System -> Use hardware acceleration when available` left as default. 

Settings in `chrome://flags/` page are left as default. 

Only extensions are `uBlock Origin`, `Violentmonkey`, `Google Docs`, `Google Docs Offline`, `Google Sheets`, and `Google Slides`. 
Those Google extensions are optional, but there must not be other extensions. 

Other settings does not matter. 

#### uBlock Origin: 

Factory settings plus these filter lists enabled: 

```
Adblock Protector List
Adblock Warning Removal List
CHN: EasyList China (中文)
```

#### Violentmonkey: 

Factory settings plus this script installed: 

```
AdBlock Protector Script
```
