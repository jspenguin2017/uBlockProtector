# Notes for the extension manifest

## Generic notes

Official documentation page: https://developer.chrome.com/extensions/manifest

Chromium documentation is generated, which means it sometimes includes weird things. Here are some extra notes that might be helpful. 

### Notes for manifest fields:

* `automation`: Experimental, https://developer.chrome.com/extensions/automation
* `background_page`: This field is probably here for legacy reasons, use `background` with field `page` instead
* `content_capabilities`: Internal use for Chromium developers only, https://bugs.chromium.org/p/chromium/issues/detail?id=573504
* `converted_from_user_script`: Internally used by Chromium, used to mark an extension as Userscript, I think it is legacy now
* `current_locale`: Internally used by Chromium, used to detect locale changes so it can update extensions UI
* `input_components`: Used by extensions that acts as Input Method Editor, I think it only works on Chromium OS, 
 https://bugs.chromium.org/p/chromium/issues/detail?id=340961#c12
* `oauth2`: OAuth2 related, I think it is legacy now `chrome.identity` is probably better, https://developer.chrome.com/extensions/identity
 https://stackoverflow.com/questions/35199571/chrome-extension-with-oauth2
* `platforms`: Used by Native Clients to separate download packages, 
 https://stackoverflow.com/questions/30397450/what-is-platforms-for-in-manifest-json
* `signature`: After 1 hour of research, I found precisely 0 documenation on it, I guess it has something to do with extension packaging, 
 probably filled internally by Chromium packaging tool, https://developer.chrome.com/extensions/packaging
* `spellcheck`: Add spellcheck dictionary, not sure if it is still experimental, 
 https://stackoverflow.com/questions/21270403/custom-spelling-in-google-chrome
* `system_indicator`: Add tray icons, is being removed, https://bugs.chromium.org/p/chromium/issues/detail?id=142450

### Notes for permissions:

* `displaySource`: Experimental, documentation page returns 404 not found, https://bugs.chromium.org/p/chromium/issues/detail?id=702686
* `idltest`: Internal use for Chromium developers only, documentation page returns 404 not found, 
 https://bugs.chromium.org/p/chromium/issues/detail?id=644010

## Specific notes for this extension

### Requested permissions:

* `storage`: Save settings for power users
* `tabs`: To inject CSS and to forcefully close a tab

### These permissions might be useful:

* `cookies`: Could be useful when monitoring changes to a cookie is needed
* `webRequest`: Could be useful when uBlock Origin's `resource.txt` does not have the resource I want
* `webRequestBlocking`: Could be useful when a complex decision is needed

# Credits

The icons are created based on icons of [uBO-Extra](https://github.com/gorhill/uBO-Extra). 
