// Check whether the browser is chrome.
const is_chrome = typeof(browser) === "undefined";
var browser = browser || chrome;
var check_playback_Exist = setInterval(function () {
    if (document.querySelector(".web-chrome-playback-controls__main")) {
        var playback_root_node = document.querySelector(".web-chrome-playback-controls__main");
        clearInterval(check_playback_Exist);
        var playback_config = { childList: true, subtree: true };
        const playback_callback = function (mutationsList, observer) {
            var playback_node = document.querySelector("button.web-chrome-playback-controls__playback-btn:nth-child(2)");
            console.log("button status changed to:");
            console.log(playback_node.getAttribute("aria-label"));
        }
        var playback_observer = new MutationObserver(playback_callback);
        playback_observer.observe(playback_root_node, playback_config);

        // Media control.
        browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
            if (message.type == "next") {
                var playback_next_node = document.querySelector("button.button-reset:nth-child(3)");
                playback_next_node.click();
                return false;
            }
            else if (message.type == "prev") {
                var playback_prev_node = document.querySelector("button.button-reset:nth-child(1)");
                playback_prev_node.click();
                return false;
            }
            else if (message.type == "pause") {
                var playback_pause_node = document.querySelector("button.button-reset:nth-child(2)");
                playback_pause_node.click();
                return false;
            }
        });
    }
}, 100);

var last_title = null
var current_title = null
var check_title_Exist = setInterval(function () {
    var title_node = document.querySelector(".web-chrome-playback-lcd__song-name-scroll-inner-text-wrapper")
    if (!title_node) {
        current_title = null;
    } else {
        current_title = title_node.textContent.trim();
    }
    if (current_title != last_title && current_title) {
        var artist_node = document.querySelector(".web-chrome-playback-lcd__sub-copy-scroll-inner-text-wrapper");
        var icon = document.querySelector("#ember15 > picture > source");
        var url = ""
        if (icon != null) {
            url = icon.getAttribute("srcset").split(' ')[0];
        }
        var art_sp = artist_node.textContent.split("—");
        var message = art_sp[0].trim() + " — " + art_sp[1].trim();
        // Chrome only supports blob/internal URL icon, need to fetch first.
        // While firefox can't fetch, it can use external URL icon anyway.
        // Why?
        if (is_chrome) {
            fetch(new Request(url)).then(
                function (res) {
                    return res.blob();
                }
            ).then(
                function (blob) {
                    browser.runtime.sendMessage({
                        type: "notification", content: {
                            "type": "basic",
                            "iconUrl": URL.createObjectURL(blob),
                            "title": current_title,
                            "message": message,
                            "buttons": []
                        }
                    });
                }
            )
            // console.log(current_title);
        } else {
            browser.runtime.sendMessage({
                type: "notification", content: {
                    "type": "basic",
                    "iconUrl": url,
                    "title": current_title,
                    "message": message,
                }
            });
        }
    }
    last_title = current_title;
}, 1000);
