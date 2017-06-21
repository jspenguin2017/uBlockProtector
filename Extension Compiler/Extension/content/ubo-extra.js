/*******************************************************************************

    uBO-Extra - A companion extension to uBlock Origin: to gain ability to
                foil early hostile anti-user mechanisms working around
                content blockers.
    Copyright (C) 2016-2017 Raymond Hill

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.

    Home: https://github.com/gorhill/uBO-WebSocket
*/

'use strict';

/* global HTMLDocument, XMLDocument */

/*******************************************************************************

    All scriptlets to inject: the scriptlets to inject are to foil or work
    around hostile anti-user mechanism used by some web sites.

**/

var scriptlets = [],
    hostname = window.location.hostname,
    contentScriptSecret =
        String.fromCharCode(Date.now() % 26 + 97) +
        Math.floor(Math.random() * 982451653 + 982451653).toString(36);

/*******************************************************************************

    Don't run on non-HTML documents.

**/

var abort = (function() {
    var doc = document;
    if ( doc instanceof HTMLDocument === false ) {
        if (
            doc instanceof XMLDocument === false ||
            doc.createElement('div') instanceof HTMLDivElement === false
        ) {
            return true;
        }
    }
    if ( (doc.contentType || '').lastIndexOf('image/', 0) === 0 ) {
        return true; 
    }
    return false;
})();

/*******************************************************************************

    Fetch hostname from ancestors if none available (we could be executed from
    inside an anonymous frame).

**/

if ( !abort ) {
    if ( hostname === '' ) {
        hostname = (function() {
            var win = window, hn = '', max = 10;
            try {
                for (;;) {
                    hn = win.location.hostname;
                    if ( hn !== '' ) { return hn; }
                    if ( win.parent === win ) { break; }
                    win = win.parent;
                    if ( !win ) { break; }
                    if ( (max -= 1) === 0 ) { break; }
                }
            } catch(ex) {
            }
            return hn;
        })();
    }
    // Don't inject if document is from local network.
    abort = /^192\.168\.\d+\.\d+$/.test(hostname);
}

/*******************************************************************************

    Websocket abuse buster.

    https://github.com/gorhill/uBlock/issues/1936

**/

(function() {
    if ( abort ) { return; }

    // webRequest API is websocket-aware as of Chromium 58: no need to
    // wrap for Chromium 58 and above.
    if ( /\bChrom(?:e|ium)\/(?:[34][0-9]|5[0-7])\b/.test(navigator.userAgent) === false ) {
        return;
    }

    // https://bugs.chromium.org/p/chromium/issues/detail?id=129353
    // https://github.com/gorhill/uBlock/issues/956
    // https://github.com/gorhill/uBlock/issues/1497
    // Trap calls to WebSocket constructor, and expose websocket-based network
    // requests to uBO's filtering engine, logger, etc.
    // Counterpart of following block of code is found in "vapi-background.js" --
    // search for "https://github.com/gorhill/uBlock/issues/1497".

    /* jshint multistr: true */

    // https://github.com/gorhill/uBlock/issues/1604
    //return;

    // Fix won't be applied on older versions of Chromium.
    if ( window.WebSocket instanceof Function === false ) { return false; }

    // Only for dynamically created frames and http/https documents.
    if ( /^(https?:|about:)/.test(window.location.protocol) !== true ) {
        return false;
    }

    var doc = document,
        parent = doc.head || doc.documentElement;
    if ( parent === null ) { return false; }

    // Websocket-attempt handler.
    self.addEventListener(contentScriptSecret, function(ev) {
        var details = ev.detail || {};
        if ( details.what !== 'websocket' ) { return; }
        var onResponseReceived = function(sender) {
            this.onload = this.onerror = null;
            dispatchEvent(new CustomEvent(sender, { detail: this.status !== 0 ? '' : 'nope' }));
        };
        var url = window.location.origin + '?' +
            'r=' + encodeURIComponent(window.location.origin) + '&' +
            'u=' + encodeURIComponent(details.url) +
            '&ubofix=f41665f3028c7fd10eecf573336216d3';
        var xhr = new XMLHttpRequest();
        xhr.open('HEAD', url);
        xhr.onload = onResponseReceived.bind(xhr, details.sender);
        xhr.onerror = onResponseReceived.bind(xhr, details.sender);
        xhr.send();
    });

    // WebSocket reference: https://html.spec.whatwg.org/multipage/comms.html
    // The script tag will remove itself from the DOM once it completes
    // execution.
    //
    // This new implementation was borrowed from https://github.com/kzar (ABP
    // developer), which is cleaner and does not have issues of the previous
    // implementation, see <https://github.com/gorhill/uBO-Extra/issues/12>.
    //
    // The scriptlet code below is based on this commit in ABP's repo:
    // https://github.com/adblockplus/adblockpluschrome/commit/457a336ee55a433217c3ffe5d363e5c6980f26f4#diff-c65c7b9a7a7b1819bef1a2957f08e8ceR441
    //
    // In order to respect authorship in the commit history, I manually
    // imported/adapted the changes above, then I committed these changes with
    // proper authorship proper information taken from the commit above (I did
    // not ask explicit permission, the license of both projects are GPLv3.)
    //
    // The 'dummy'local variable in WrappedWebSocket is needed. See
    // https://github.com/uBlockOrigin/uAssets/issues/227#issuecomment-275879231

    var scriptlet = function(secret) {
        var RealWebSocket = window.WebSocket,
            addEventListener = self.addEventListener.bind(window),
            removeEventListener = self.removeEventListener.bind(window),
            dispatchEvent = self.dispatchEvent.bind(window);

        var queryContentScript = function(websocket, url) {
            var uid = secret + Math.floor(Math.random() * 982451653 + 982451653).toString(36);
            var handler = function(ev) {
                removeEventListener(ev.type, handler);
                if ( ev.detail === 'nope' ) { websocket.close(); }
            };
            addEventListener(uid, handler);
            dispatchEvent(new CustomEvent(secret, {
                detail: { what: 'websocket', sender: uid, url: url }
            }));
        };

        var WrappedWebSocket = function(url) {
            var surl = url.toString(),
                dummy = url.toString();
            // Throw correct exceptions if the constructor is used improperly.
            if ( this instanceof WrappedWebSocket === false ) {
                return RealWebSocket();
            }
            if ( arguments.length < 1 ) {
                return new RealWebSocket();
            }
            var websocket = arguments.length === 1 ?
                new RealWebSocket(surl) :
                new RealWebSocket(surl, arguments[1]);
            queryContentScript(websocket, surl);
            return websocket;
        };

        WrappedWebSocket.prototype = RealWebSocket.prototype;
        window.WebSocket = WrappedWebSocket.bind(window);

        Object.defineProperties(window.WebSocket, {
            CONNECTING: { value: RealWebSocket.CONNECTING, enumerable: true },
            OPEN: { value: RealWebSocket.OPEN, enumerable: true },
            CLOSING: { value: RealWebSocket.CLOSING, enumerable: true },
            CLOSED: { value: RealWebSocket.CLOSED, enumerable: true },
            name: { value: 'WebSocket' },
            prototype: { value: RealWebSocket.prototype }
        });
    };

    scriptlets.push({
        scriptlet: scriptlet,
        exceptions: [
            'beam.pro',
            'plex.tv',
        ]
    });
})();

/*******************************************************************************

    Instart Logic buster v1

    https://github.com/uBlockOrigin/uAssets/issues/227

**/

(function() {
    if ( abort ) { return; }

    var scriptlet = function() {
        var url = document.URL;
        if ( /^https?:\/\//.test(url) === false ) { return; }
        window.stop();
        var req = new XMLHttpRequest();
        req.open('GET', window.location.href);
        req.onload = function() {
            this.onload = null;
            var parser = new DOMParser();
            var doc = parser.parseFromString(this.responseText, 'text/html');
            if ( doc === null ) { return; }
            var nodes = doc.querySelectorAll('script');
            var i = nodes.length,
                script;
            while ( i-- ) {
                script = nodes[i];
                if ( /\b(?:g00|I10C|I11C|INSTART)\b/.test(script.textContent) ) {
                    script.parentNode.removeChild(script);
                }
            }
            document.open();
            document.write(doc.documentElement.outerHTML); // jshint ignore:line
            document.close();
        };
        req.send(null);
    };

    scriptlets.push({
        scriptlet: scriptlet,
        targets: [
            'baltimoresun.com',
            'boston.com',
            'calgarysun.com',
            'capitalgazette.com',
            'carrollcountytimes.com',
            'celebslam.com',
            'celebuzz.com',
            'chicagotribune.com',
            'citypaper.com',
            'computershopper.com',
            'courant.com',
            'csgoutpost.com',
            'ctnow.com',
            'cycleworld.com',
            'dailypress.com',
            'deathandtaxesmag.com',
            'delmartimes.net',
            'edmontonsun.com',
            'everydayhealth.com',
            'extremetech.com',
            'fieldandstream.com',
            'financialpost.com',
            'gamerevolution.com',
            'geek.com',
            'gofugyourself.com',
            'growthspotter.com',
            'hearthhead.com',
            'hoylosangeles.com',
            'ibtimes.com',
            'idigitaltimes.com',
            'infinitiev.com',
            'lajollalight.com',
            'lifewire.com',
            'lolking.net',
            'mcall.com',
            'mamaslatinas.com',
            'mmo-champion.com',
            'nasdaq.com',
            'orlandosentinel.com',
            'ottawasun.com',
            'pcmag.com',
            'popphoto.com',
            'popsci.com',
            'ranchosantafereview.com',
            'ranker.com',
            'realclearpolitics.com',
            'redeyechicago.com',
            'sandiegouniontribune.com',
            'saveur.com',
            'sherdog.com',
            'slickdeals.net',
            'southflorida.com',
            'spin.com',
            'sporcle.com',
            'stereogum.com',
            'sun-sentinel.com',
            'tf2outpost.com',
            'thefrisky.com',
            'thespruce.com',
            'thesuperficial.com',
            'thoughtco.com',
            'timeanddate.com',
            'tmn.today',
            'torontosun.com',
            'twincities.com',
            'vancouversun.com',
            'vibe.com',
            'winnipegsun.com',
            'wowhead.com',
            'zam.com',
        ]
    });
})();

/*******************************************************************************

    Instart Logic buster: v2

    https://github.com/uBlockOrigin/uAssets/issues/227#issuecomment-268409666

**/

(function() {
    if ( abort ) { return; }

    var scriptlet = function() {
        var magic = String.fromCharCode(Date.now() % 26 + 97) +
                    Math.floor(Math.random() * 982451653 + 982451653).toString(36);
        var makeNanovisorProxy = function() {
            return new Proxy({}, {
                get: function(target, name) {
                    switch ( name ) {
                    case 'HtmlStreaming':
                        return {
                            InsertTags: function(a, b) {
                                document.write(b); // jshint ignore:line
                            },
                            InterceptNode: function() {
                            },
                            PatchBegin: function() {
                            },
                            PatchEnd: function() {
                            },
                            PatchInit: function() {
                            },
                            ReloadWithNoHtmlStreaming: function() {
                            },
                            RemoveTags: function() {
                            },
                            UpdateAttributes: function() {
                            }
                        };
                    default:
                        return target[name];
                    }
                },
                set: function(target, name, value) {
                    switch ( name ) {
                    case 'CanRun':
                        target.CanRun = function() {
                            return false;
                        };
                        break;
                    default:
                        target[name] = value;
                    }
                }
            });
        };
        var instartInit;
        window.I10C = makeNanovisorProxy();
        window.INSTART = new Proxy({}, {
            get: function(target, name) {
                switch ( name ) {
                case 'Init':
                    return function(a) {
                        if (
                            a instanceof Object &&
                            typeof a.nanovisorGlobalNameSpace === 'string' &&
                            a.nanovisorGlobalNameSpace !== ''
                        ) {
                            window[a.nanovisorGlobalNameSpace] = makeNanovisorProxy();
                        }
                        a.enableHtmlStreaming = false;
                        a.enableQSCallDiffComputationConfig = false;
                        a.enableQuerySelectorMonitoring = false;
                        a.serveNanovisorSameDomain = false;
                        a.virtualDomains = 0;
                        a.virtualizeDomains = [];
                        instartInit(a);
                    };
                default:
                    if ( target[name] === undefined ) {
                        throw new Error(magic);
                    }
                    return target[name];
                }
            },
            set: function(target, name, value) {
                switch ( name ) {
                case 'Init':
                    instartInit = value;
                    break;
                default:
                    target[name] = value;
                }
            }
        });
        var oe = window.error;
        window.onerror = function(msg, src, line, col, error) {
            if ( msg.indexOf(magic) !== -1 ) {
                return true;
            }
            if ( oe instanceof Function ) {
                return oe(msg, src, line, col, error);
            }
        }.bind();
    };

    scriptlets.push({
        scriptlet: scriptlet,
        targets: [
            'calgaryherald.com',
            'edmontonjournal.com',
            'edmunds.com',
            'financialpost.com',
            'leaderpost.com',
            'montrealgazette.com',
            'nationalpost.com',
            'ottawacitizen.com',
            'theprovince.com',
            'thestarphoenix.com',
            'windsorstar.com',
        ]
    });
})();

/*******************************************************************************

    Instart Logic buster 3

    https://github.com/gorhill/uBlock/issues/2702

**/

(function() {
    if ( abort ) { return; }

    var scriptlet = function() {
        var realConsole = console,
            realLog = console.log,
            dummy;
        console.log = function () {
            for ( var i = 0; i < arguments.length; i++ ) {
                var arg = arguments[i];
                if ( arg instanceof HTMLElement ) {
                    dummy = arg.toString() + arg.id;
                }
            }
            return realLog.apply(realConsole, arguments);
        }.bind(console);
        Object.defineProperty(console.log, 'name', { value: 'log' });
    };

    scriptlets.push({
        scriptlet: scriptlet,
        targets: [
            'hockeysfuture.com',
        ]
    });
})();

/*******************************************************************************

    Instart Logic console detection defuser.

    To allow using the dev tools to investigate IL's code:
    - Un-comment out the block of code
    - Add the site you wish to investigate in the `targets` array.

**/

/*
(function() {
    if ( abort ) { return; }

    var scriptlet = function() {
        var realConsole = console,
            realLog = console.log;
        console.log = function () {
            for ( var i = 0; i < arguments.length; i++ ) {
                if ( arguments[i] instanceof HTMLElement ) { return; }
            }
            return realLog.apply(realConsole, arguments);
        }.bind(console);
        Object.defineProperty(console.log, 'name', { value: 'log' });
    };

    scriptlets.push({
        scriptlet: scriptlet,
        targets: [
        ]
    });
})();
*/

/*******************************************************************************

    WebRTC abuse: generic.

    https://github.com/uBlockOrigin/uAssets/issues/251

**/

(function() {
    if ( abort ) { return; }

    // Nothing to fix for browsers not supporting RTCPeerConnection.
    if (
        window.RTCPeerConnection instanceof Function === false &&
        window.webkitRTCPeerConnection instanceof Function === false
    ) {
        return;
    }

    var scriptlet = function() {
        var RealRTCPeerConnection = window.RTCPeerConnection ||
                                    window.webkitRTCPeerConnection;
        var WrappedRTCPeerConnection = function(config) {
            if ( this instanceof WrappedRTCPeerConnection === false ) {
                return RealRTCPeerConnection();
            }
            var win = window, location = win.location, max = 10;
            try {
                for (;;) {
                    location = win.location;
                    if ( win.parent === win ) { break; }
                    win = win.parent;
                    if ( !win ) { break; }
                    if ( (max -= 1) === 0 ) { break; }
                }
            } catch(ex) {
            }
            var scheme = location.protocol === 'https:' ? 'wss' : 'ws',
                wsURL = scheme + '://' + location.hostname + '/';
            var rtcURL = config &&
                         config.iceServers &&
                         config.iceServers[0] &&
                         config.iceServers[0].urls &&
                         config.iceServers[0].urls;
            if ( Array.isArray(rtcURL) && rtcURL.length !== 0 ) {
                rtcURL = rtcURL[0];
            }
            if ( !rtcURL ) { rtcURL = ''; }
            try {
                (new window.WebSocket(wsURL)).close();
            } catch(ex) {
                var msg = ex.message.replace(wsURL, rtcURL)
                                    .replace('WebSocket', 'RTCPeerConnection');
                throw new Error(msg, '', 0);
            }
            if ( arguments.length === 0 ) {
                return new RealRTCPeerConnection();
            }
            return new RealRTCPeerConnection(config);
        };
        WrappedRTCPeerConnection.prototype = RealRTCPeerConnection.prototype;
        var bound = WrappedRTCPeerConnection.bind(window);
            bound.prototype = {
            createAnswer: RealRTCPeerConnection.prototype.createAnswer,
            createOffer: RealRTCPeerConnection.prototype.createOffer,
            generateCertificate: RealRTCPeerConnection.prototype.generateCertificate
         };
        if ( window.RTCPeerConnection instanceof Function ) {
            window.RTCPeerConnection = bound;
            Object.defineProperty(window.RTCPeerConnection, 'name', {
                value: 'RTCPeerConnection'
            });
        }
        if ( window.webkitRTCPeerConnection instanceof Function ) {
            window.webkitRTCPeerConnection = bound;
            Object.defineProperty(window.webkitRTCPeerConnection, 'name', {
                value: 'webkitRTCPeerConnection'
            });
        }
    };

    scriptlets.push({
        scriptlet: scriptlet,
        exceptions: [
            'hangouts.google.com',
            'meet.google.com',
            'messenger.com',
        ],
    });
})();

/*******************************************************************************

    Upmanager

    https://github.com/uBlockOrigin/uAssets/issues/251#issuecomment-276257642

**/

(function() {
    if ( abort ) { return; }

    var scriptlet = function() {
        var magic = String.fromCharCode(Date.now() % 26 + 97) +
                    Math.floor(Math.random() * 982451653 + 982451653).toString(36);
        var oe = window.error;
        window.onerror = function(msg, src, line, col, error) {
            if ( msg.indexOf(magic) !== -1 ) { return true; }
            if ( oe instanceof Function ) {
                return oe(msg, src, line, col, error);
            }
        }.bind();
        Object.defineProperty(window, 'upManager', {
            set: function() {
                throw new Error(magic);
            }
        });
    };

    scriptlets.push({
        scriptlet: scriptlet,
        targets: [
            '101greatgoals.com',
            'allthetests.com',
            'biology-online.org',
            'destructoid.com',
            'eurweb.com',
            'fullmatchesandshows.com',
            'grammarist.com',
            'jerusalemonline.com',
            'lucianne.com',
            'phonesreview.co.uk',
            'thefreethoughtproject.com',
            'veteranstoday.com',
            'walla.co.il',
            'yad2.co.il',
        ]
    });
})();

/*******************************************************************************

    Collate and add scriptlets to document.

**/

(function() {
    if ( scriptlets.length === 0 ) { return; }

    var restrFromString = function(s) {
        return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    var reFromArray = function(aa) {
        return new RegExp('(^|\\.)(' + aa.map(restrFromString).join('|') + ')$');
    };

    var scriptText = [], entry, re;

    while ( (entry = scriptlets.shift()) ) {
        if ( Array.isArray(entry.targets) ) {
            re = reFromArray(entry.targets);
            if ( re.test(hostname) === false ) { continue; }
        } else if ( Array.isArray(entry.exceptions) ) {
            re = reFromArray(entry.exceptions);
            if ( re.test(hostname) ) { continue; }
        }
        scriptText.push('(' + entry.scriptlet.toString() + ')("' + contentScriptSecret + '");');
    }

    if ( scriptText.length === 0 ) { return; }

    // Have the script tag remove itself once executed (leave a clean
    // DOM behind).
    var cleanup = function() {
        var c = document.currentScript, p = c && c.parentNode;
        if ( p ) {
            p.removeChild(c);
        }
    };
    scriptText.push('(' + cleanup.toString() + ')();');

    var elem = document.createElement('script');
    elem.appendChild(document.createTextNode(scriptText.join('\n')));
    try {
        (document.head || document.documentElement).appendChild(elem);
    } catch(ex) {
    }
})();
