const is_chrome = typeof(browser) === "undefined";
var browser = browser || chrome;
browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type == "notification") {
        browser.notifications.create(message.content);
        // return false;
        return;
    }
});
browser.commands.onCommand.addListener(function (name) {
    var message = null;
    if (name == "next-song") {
        message = { type: "next" };
        console.log("next");
    }
    else if (name == "previous-song") {
        message = { type: "prev" };
        console.log("prev");
    }
    else if (name == "pause") {
        message = { type: "pause" };
        console.log("pause");
    }
    // Chrome uses callback instead of promise.
    // Why?
    if (is_chrome) {
        browser.tabs.query({ "url": "*://*.music.apple.com/*" }, function (tablist) {
            for (let tab of tablist) {
                browser.tabs.sendMessage(tab.id, message);
            }
        });
    } else {
        browser.tabs.query({ "url": "*://*.music.apple.com/*" }).then(function (tablist) {
            for (let tab of tablist) {
                browser.tabs.sendMessage(tab.id, message);
            }
        });
    }
})
