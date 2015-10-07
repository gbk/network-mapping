/* 
* @Author: caoke
* @Date:   2015-06-07 22:28:18
* @Last Modified by:   caoke
* @Last Modified time: 2015-10-07 21:47:29
*/

'use strict';

var showIP = !!window.get('showIP');
var cache = {};

window.queryShowIP = function() {
    return showIP;
};

window.toggleShowIP = function() {
    window.set('showIP', showIP = !showIP);

    // toggle showing ip on current selected tab
    chrome.tabs.getSelected(function(tab) {
        if (showIP) {
            if (tab.id in cache) {
                insertDOM(tab.id, cache[tab.id]);
            }
        } else {
            clearDOM(tab.id);
        }
    });

    return showIP;
}

var id = randomChars('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 20);

// listen to all main_frame request & record their IPs
chrome.webRequest.onCompleted.addListener(function(details) {
    cache[details.tabId] = details.ip;
    showIP && insertDOM(details.tabId, details.ip);
}, {
    urls: [
        'http://*/*',
        'https://*/*'
    ],
    types: [ 'main_frame' ]
});

// generate random chars for inserted dom
function randomChars(pool, length) {
    var chars = [];
    for (var i = 0; i < length; i++) {
        chars.push(pool.charAt(Math.floor(Math.random() * pool.length)));
    }
    return chars.join('');
}

// insert dom that shows ip
function insertDOM(tabId, ip) {
    chrome.tabs.executeScript(tabId, {
        code: [
            '(function(ip){',
                'if(ip){',
                    'ip.innerHTML="' + ip + '"',
                '}else{',
                    'ip=document.createElement("div");',
                    'ip.id="' + id + '";',
                    'ip.title="IP address of this tab.\\nClick here to hide";',
                    'ip.innerHTML="' + ip + '";',
                    'document.body.appendChild(ip);',
                    'ip.onclick=function(){',
                        'ip.className="fade";',
                        'setTimeout(function(){',
                            'ip.parentNode.removeChild(ip)',
                        '},1000)',
                    '}',
                '}',
            '})(document.getElementById("' + id + '"))'
        ].join('')
    }, function() {
        chrome.runtime.lastError;
    });
    chrome.tabs.insertCSS(tabId, {
        code: [
            '#' + id + '{',
                'display:inline-block;',
                'position:fixed;',
                'bottom:18px;',
                'left:5px;',
                'z-index:2147483647;',
                'width:auto;',
                'height:auto;',
                'margin:0;',
                'padding:0 .5em;',
                'border:none;',
                'border-radius:6px;',
                'background:rgba(0,0,0,.3);',
                'transition:all 1s;',
                'cursor:pointer;',
                'line-height:1.3em;',
                'letter-spacing:normal;',
                'text-align:center;',
                'text-indent:0;',
                'text-decoration:none;',
                'font-family:tahoma,arial;',
                'font-size:20px;',
                'font-weight:bold;',
                'color:#fff',
            '}',
            '#' + id + ':hover{',
                'background:rgba(0,0,0,.7)',
            '}',
            '#' + id + '.fade{',
                'opacity:0',
            '}'
        ].join('')
    }, function() {
        chrome.runtime.lastError;
    });
}

// delete the dom
function clearDOM(tabId) {
    chrome.tabs.executeScript(tabId, {
        code: [
            '(function(ip){',
                'ip&&ip.parentNode.removeChild(ip)',
            '})(document.getElementById("' + id + '"))'
        ].join('')
    }, function() {
        chrome.runtime.lastError;
    });
}
