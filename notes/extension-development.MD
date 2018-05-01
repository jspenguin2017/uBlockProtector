# Notes for Chromium extension development

## Generic notes

Official manifest documentation page:
https://developer.chrome.com/extensions/manifest

Official API documentation page:
https://developer.chrome.com/extensions/api_index

Chromium documentation is generated, which means it sometimes includes weird
things. Here are some extra notes that might be helpful.

### Notes for manifest fields

* `automation`: Experimental, https://developer.chrome.com/extensions/automation
* `background_page`: This field is probably here for legacy reasons, use
  `background` with field `page` instead
* `content_capabilities`: Internal use for Chromium developers only,
  https://bugs.chromium.org/p/chromium/issues/detail?id=573504
* `converted_from_user_script`: Internally used by Chromium, used to mark an
  extension as Userscript, I think it is legacy now
* `current_locale`: Internally used by Chromium, used to detect locale changes
  so it can update extension UI
* `input_components`: Used by extensions that acts as Input Method Editor, I
  think it only works on Chromium OS,
  https://bugs.chromium.org/p/chromium/issues/detail?id=340961#c12
* `oauth2`: OAuth2 related, I think it is legacy now, `chrome.identity` is
  probably better, https://developer.chrome.com/extensions/identity
  https://stackoverflow.com/questions/35199571/chrome-extension-with-oauth2
* `platforms`: Used by Native Clients to separate download packages,
  https://stackoverflow.com/questions/30397450/what-is-platforms-for-in-manifest-json
* `signature`: After 1 hour of research, I found precisely 0 documenation on
  it, I guess it has something to do with extension packaging, probably filled
  internally by Chromium packaging tool,
  https://developer.chrome.com/extensions/packaging
* `spellcheck`: Add spellcheck dictionary, not sure if it is still experimental,
  https://stackoverflow.com/questions/21270403/custom-spelling-in-google-chrome
* `system_indicator`: Add tray icons, it is being removed,
  https://bugs.chromium.org/p/chromium/issues/detail?id=142450

### Notes for permissions

* `displaySource`: Experimental, documentation page returns 404 not found,
  https://bugs.chromium.org/p/chromium/issues/detail?id=702686
* `idltest`: Internal use for Chromium developers only, documentation page
  returns 404 not found,
  https://bugs.chromium.org/p/chromium/issues/detail?id=644010

## Specific notes for Nano Defender

### Requested permissions

* `tabs`: To inject CSS and to forcefully close tabs
* `webNavigation`: To know the URL of each tab and frame
* `webRequest`: To redirect requests and to modify headers
* `webRequestBlocking`: Some `webRequest` handling need to be synchronous

### Permissions that might be useful

* `cookies`: Could be useful when monitoring changes to a cookie is needed, but
  this is asynchronous, could be hard to use
