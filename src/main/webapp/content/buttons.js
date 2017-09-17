'use strict';

(function () {

    function onCloseBtnClick() {
        try {
            browser.runtime.sendMessage({
                topic: 'ciobi-close'
            });
        } catch (e) {
            alert(`Error: ${e}`);
        }

    }

    function onBackBtnClick() {
        window.history.back();
    }

    // from https://developer.mozilla.org/en-US/Add-ons/Overlay_Extensions/XUL_School/DOM_Building_and_HTML_Insertion#innerHTML_with_HTML_Escaping
    function escapeHTML(str) { return str.replace(/[&"'<>]/g, (m) => escapeHTML.replacements[m]); }
    escapeHTML.replacements = { "&": "&amp;", '"': "&quot;", "'": "&#39;", "<": "&lt;", ">": "&gt;" };

    function onFullScreenBtnClick() {
        try {
            browser.runtime.sendMessage({
                topic: 'ciobi-full-screen'
            });
        } catch (e) {
            alert(`Error: ${e}`);
        }
    }

    let head = document.getElementsByTagName('head')[0];
    let style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    let url = browser.extension.getURL("font/font-awesome-small.woff2"); // font with just 3 glyphs, created via http://fontello.com/
    let css = '' +
        '@font-face {' +
        '  font-family: "FontAwesome1";' +
        '  src: url("' + url + '");' +
        '}';
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);

    // futile attempt to make buttons look the same in all windows (the problem is that there are hundreds of attributes and no style that defines them all)
    let btnStyle = 'min-height: 70px; min-width: 70px; max-height: 70px; max-width: 70px; position: fixed; right: 10px; opacity: 0.3; ' +
        'background: #616161; color: #000; font-family: FontAwesome1; font-weight: 400; font-size: 250%; margin: 0; padding: 0; text-transform: none; line-height: 1; ' +
        'cursor: pointer; border-radius: 14px; text-decoration: none; display: inline-block; box-shadow: none; border: none; z-index: 9999; ';


    let node = document.createElement('div');
    node.innerHTML = /*escapeHTML*/( //this causes a "Unsafe assignment to innerHTML" warning when submitting the extension. The fix is probably to create all
        // elements manually (https://developer.mozilla.org/en-US/Add-ons/Overlay_Extensions/XUL_School/DOM_Building_and_HTML_Insertion#innerHTML_with_HTML_Escaping tells
        // to use an escape function, but that will just turn the buttons into text)
        '<button id="ciobiCloseBtn" type="button" style="top: 100px; ' + btnStyle + ' ">&#xf00d;</button>' +
        '<button id="ciobiBackBtn" type="button" style="top: 180px; ' + btnStyle + ' ">&#xf060;</button>' +
        '<button id="ciobiFullScreenBtn" type="button" style="top: 260px; ' + btnStyle + ' ">&#xf0b2;</button>');  //ttt2 maybe change icon when state changes
    // alternative arrows:      &#10140; &#10137; &larr;
    // mirror vertically:       transform: scale(-1, 1);
    // alternative close: &#xf2d4;
    // alternative full screen: &#128470; &#xf047;

    document.body.appendChild(node);
    document.getElementById("ciobiCloseBtn").onclick = onCloseBtnClick; //ttt2 perhaps use appendChild() to create the buttons and assign onclick, so IDs won't be needed
    document.getElementById("ciobiBackBtn").onclick = onBackBtnClick;
    document.getElementById("ciobiFullScreenBtn").onclick = onFullScreenBtnClick;
}());
