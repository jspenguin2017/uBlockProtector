//This file contains rules that are not quite working, they are only activated in debug mode
"use strict";

if (a.debugMode) {
    if (a.domCmp(["itv.com"])) {
        //Test link: https://www.itv.com/hub/take-me-out/1a8716a0089
        //===DEBUG CODE===
        //Can find the URL of the media file and subtitle file
        const videoJS = (sources, types, subtitles, width, height) => {
            return ""; //Insert videoJS payload here... No working ones found yet...
        };
        a.ready(() => {
            //Find the player element
            const playerElem = $("#video");
            if (!playerElem.length) {
                console.error("uBlock Protector failed to find video player element!");
                return;
            }
            //Find the media URL
            a.request({
                method: "POST",
                url: playerElem.attr("data-video-playlist"),
                headers: {
                    "hmac": playerElem.attr("data-video-hmac").toUpperCase(),
                    "Accept": "application/vnd.itv.vod.playlist.v2+json",
                    "Content-Type": "application/json",
                },
                payload: `{"user":{"itvUserId":"","entitlements":[],"token":""},"device":{"manufacturer":"Chrome","m` +
                `odel":"59","os":{"name":"Windows NT","version":"10.0","type":"desktop"}},"client":{"version":"4.` +
                `1","id":"browser"},"variantAvailability":{"featureset":{"min":["mpeg-dash","clearkey","outband-w` +
                `ebvtt"],"max":["mpeg-dash","clearkey","outband-webvtt"]},"platformTag":"dotcom"}}`,
            }, (response) => {
                //Parse response
                let data;
                try {
                    data = JSON.parse(response);
                    data = data.Playlist.Video;
                    if (!data.MediaFiles) {
                        throw "Media URL Not Found";
                    }
                } catch (err) {
                    console.error("uBlock Protector failed to find media URL!");
                    return;
                }
                //Build media source
                let sources = [], types = [], subtitles = [];
                for (let i = 0; i < data.MediaFiles.length; i++) {
                    sources.push(data.Base + data.MediaFiles[i].Href);
                    //The payload requests that only "mpeg-dash" format to be sent
                    //Below is the MIME type of this format
                    types.push("application/dash+xml");
                }
                if (data.Subtitles) {
                    for (let i = 0; i < data.Subtitles.length; i++) {
                        //The subtitle format is "outband-webvtt"
                        subtitles.push(data.Base + data.Subtitles[i].Href);
                    }
                }
                //===Debug Log===
                console.log(data);
                console.log(sources);
                console.log(types);
                console.log(subtitles);
                //===End Log===
                //Replace player
                const playerWrapper = $(".stage__player-wrapper");
                const width = playerWrapper.width();
                const height = playerWrapper.height();
                playerWrapper.html(videoJS(sources, types, subtitles, width, height));
            }, () => {
                console.error("uBlock Protector failed to find media URL!");
            });
        });
    }
    if (a.domCmp(["viasport.fi"])) {
        //===DEBUG CODE===
        let isInBackground = false;
        const idMatcher = /\/(\d+)/;
        const reMagicValidator = /^[a-zA-Z0-9]+$/;
        const magic = a.uid();
        addEventListener(magic, (e) => {
            if (reMagicValidator.test(e.detail)) {
                //Request data JSON
                a.request({
                    method: "GET",
                    url: `https://viasport.mtg-api.com/stream-links/viasport/web/se/clear-media-guids/${id}/streams`,
                }, (result) => {
                    if (a.debugMode) {
                        console.info("Response received:");
                        console.info(result);
                    }
                    parser(result);
                }, () => {
                    console.error("uBlock Protector failed to find media URL!");
                });
            } else {
                //Could not find video ID
                setTimeout(handler, 1000);
            }
        });
        const videoJS = (source, type, width, height) => {
            return `<iframe srcdoc='<html><head><link href="https://cdnjs.cloudflare.com/ajax/libs/video.js/5.10.5/al` +
                `t/video-js-cdn.min.css" rel="stylesheet"><script src="https://cdnjs.cloudflare.com/ajax/libs/video.j` +
                `s/5.10.5/video.min.js"><\/script><script src="https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib` +
                `-hls/3.1.0/videojs-contrib-hls.min.js"><\/script><style type="text/css">html, body{padding:0; margin` +
                `:0;}.vjs-default-skin{color:#eee}.vjs-default-skin .vjs-play-progress,.vjs-default-skin .vjs-volume-` +
                `level{background-color:#eee}.vjs-default-skin .vjs-big-play-button,.vjs-default-skin .vjs-control-ba` +
                `r{background:rgba(0,0,0,.2)}.vjs-default-skin .vjs-slider{background:rgba(0,0,0,.3)}</style></head><` +
                `body><video id="uBlock_Protector_Video_Player" class="video-js vjs-default-skin" controls preload="a` +
                `uto" width="${width}" height="${height}"><source src="${source}" type="${type}"></video><script>vide` +
                `ojs("uBlock_Protector_Video_Player")<\/script></body></html>' width="${width}" height="${height}" fr` +
                `ameborder="0" scrolling="no" allowfullscreen="true"></iframe>`;
        };
        const handler = () => {
            if (isInBackground) {
                setTimeout(handler, 1000);
                return;
            }
            a.inject(`(() => {
                //Find video ID
                let id;
                const magic = "${magic}";
                try {
                    id = window.__STATE__.dataSources.article[0].videos[0].data.mediaGuid;
                    if (!id) {
                        throw "Media ID Not Found";
                    }
                    window.dispatchEvent(new window.CustomEvent(magic, {
                        detail: id,
                    }));
                } catch (err) {
                    window.dispatchEvent(new window.CustomEvent(magic, {
                        detail: " ",
                    }));
                }
            })();`, true);
        };
        const parser = (data) => {
            //Parse response
            let url;
            try {
                const parsedData = JSON.parse(data);
                url = parsedData.embedded.prioritizedStreams[0].links.stream.href;
                if (!url) {
                    throw "Media URL Not Found";
                }
            } catch (err) {
                console.error("uBlock Protector failed to find media URL!");
                return;
            }
            //Replace player
            const player = $(".thumbnail-video");
            const height = player.height();
            const width = player.width();
            //===Debug Only===
            //Nuke the document because something keeps replacing my player
            stop();
            document.body.innerHTML = videoJS(url, "application/x-mpegURL", width, height);
            //===Debug Only===
        };
        //Start
        handler();
        a.on("focus", () => { isInBackground = false; });
        a.on("blur", () => { isInBackground = true; });
    }
}
