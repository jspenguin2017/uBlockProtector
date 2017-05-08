### The standard configuration

This is the standard configuration that all our tests will run on. You may choose to configure your setup differently, but we may not fix issues that we cannot reproduct and we may not accept solutions that fails in our tests. 

Everything updated to the latest version. 

#### Chrome: 

Settings under `Privacy -> Content settings...` are left as default. 

`Privacy -> Send a "Do Not Track" request with your browsing traffic` enabled. 

Only extensions are uBlock Origin and Tampermonky. 

Everything else does not matter. 

#### uBlock Origin: 

Factory settings plus these filter lists enabled: 

```
Adblock Protector List
Adblock Warning Removal List
CHN: EasyList China (中文)
```

#### Tampermonkey: 

Factory settings plus this script installed: 

```
AdBlock Protector Script
```
