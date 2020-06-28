'use strict';

(function () {

    // This file is needed because content scripts don't have access to some APIs for tab and window manipulation
    //   https://stackoverflow.com/questions/40996014/typeerror-api-is-undefined-in-content-script-or-why-cant-i-do-this-in-a-cont
    //   https://developer.mozilla.org/en-US/Add-ons/WebExtensions/manifest.json/permissions

    function onRemoved() {
    }

    let nonFullState = "normal";

    function onFullScreenGet(windowInfo) {
        if (windowInfo.state !== "fullscreen") {
            nonFullState = windowInfo.state;
        }
        let updateInfo = {
            state: windowInfo.state === "fullscreen" ? nonFullState : "fullscreen" // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/WindowState
        };
        let updating = browser.windows.update(windowInfo.id, updateInfo);
        updating.then(onFullScreenToggled, onError);
    }

    function onFullScreenToggled(info) {
    }

    function onError(error) {
        console.error(`Error: ${error}`);
    }


    browser.runtime.onMessage.addListener((message, sender) => {

        if (message.topic === 'ciobi-close') {
            let removing = browser.tabs.remove(sender.tab.id);
            removing.then(onRemoved, onError);
        } else if (message.topic === 'ciobi-full-screen') {
            let getting = browser.windows.get(sender.tab.windowId);
            getting.then(onFullScreenGet, onError);
        }

        return false;
    });
}());
