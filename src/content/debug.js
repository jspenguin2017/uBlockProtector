/**
 * Content rules for debugging. Only run in debug mode.
 */
"use strict";

//@pragma-if-debug

// Tools
if (a.debugMode) {
    if (a.domCmp(["twitch.tv"], true)) {
        // Force Twitch to show debug logs
        a.readOnly("log", "window.console.log.bind(window.console)", "window.console");
        a.readOnly("warn", "window.console.warn.bind(window.console)", "window.console");
        a.readOnly("error", "window.console.error.bind(window.console)", "window.console");
    }
}

// Rules
if (a.debugMode) {
    if (a.domCmp(["fox.com"])) {
        // https://github.com/jspenguin2017/uBlockProtector/issues/660
        a.replaceXHR(() => {

            console.warn("[Nano] xhr", url);

            if (url.includes("uplynk.com/preplay")) {
                this.addEventListener("readystatechange", () => {
                    if (this.readyState === 4) {
                        try {

                            console.warn(this.responseText);

                            let payload = window.JSON.parse(this.responseText);
                            payload.ads = {};
                            replace(this, window.JSON.stringify(payload));
                        } catch (err) { }
                    }
                });
            }
        });
        a.inject(() => {
            "use strict";
            const _fetch = window.fetch;
            window.fetch = (...args) => {

                console.warn("[Nano] fetch", args);

                return _fetch.apply(window, args);
            };
        });
    }
    if (a.domCmp(["webnovel.com"])) {
        // https://github.com/jspenguin2017/uBlockProtector/issues/457
        const bookExtractor = /\/book\/([^/]+)/;
        let isInBackground = false;
        const scanner = () => {
            if (isInBackground) {
                return;
            }
            $(".cha-content._lock").each((lock) => {
                lock.classList.remove("_lock");
                const video = lock.closest(".chapter_content").querySelector(".lock-video");
                if (video) {
                    video.remove();
                }

                const contentElem = lock.querySelector(".cha-words");
                contentElem.insertAdjacentHTML("beforeend", "<p style='opacity:0.5;'>" +
                    "Nano Defender is fetching the rest of this chapter, this can take up to 15 seconds.</p>");

                const bookID = bookExtractor.exec(location.href)[1];
                const chapterID = lock.querySelector("[data-cid]").dataset.cid;
                if (!bookID || !chapterID) {
                    return;
                }
                const cookie = encodeURIComponent(a.cookie("_csrfToken"));

                $.request({
                    method: "GET",
                    url: `https://www.webnovel.com/apiajax/chapter/GetChapterContentToken?_csrfToken=` +
                    `${cookie}&bookId=${bookID}&chapterId=${chapterID}`,
                }, (data) => {
                    try {
                        let token = JSON.parse(data).data.token;
                        token = encodeURIComponent(token);
                        fetchChapter(cookie, token, contentElem);
                    } catch (err) {
                        console.error("[Nano] Failed :: Find Chapter Token");
                    }
                }, () => {
                    console.error("[Nano] Failed :: Find Chapter Token");
                });
            });
        };
        const fetchChapter = (cookie, token, contentElem) => {
            const tick = () => {
                $.request({
                    method: "GET",
                    url: `https://www.webnovel.com/apiajax/chapter/GetChapterContentByToken?_csrfToken=` +
                    `${cookie}&token=${token}`,
                }, (data) => {
                    try {
                        const content = JSON.parse(data).data.content.trim();
                        if (content) {
                            contentElem.innerHTML = content;
                            setTimeout(() => {
                                drawChapter(content, contentElem);
                            }, 500);
                        } else {
                            setTimeout(tick, 2000);
                        }
                    } catch (err) {
                        setTimeout(tick, 2000);
                    }
                }, () => {
                    setTimeout(tick, 2000);
                });
            };
            tick();
        };
        const drawChapter = (content, contentElem) => {
            if (!contentElem.innerHTML.includes("<p>")) {
                const lines = content.split("\n");
                contentElem.innerHTML = "";
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) {
                        continue;
                    }
                    const p = document.createElement("p");
                    p.textContent = line;
                    contentElem.append(p);
                }
            }
        };
        setInterval(scanner, 1000);
        a.on("focus", () => { isInBackground = false; });
        a.on("blur", () => { isInBackground = true; });
    }
}

//@pragma-end-if
