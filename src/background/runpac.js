/* 
* @Author: caoke
* @Date:   2015-06-07 22:30:00
* @Last Modified by:   caoke
* @Last Modified time: 2015-10-07 22:45:48
*/

'use strict';

window.queryPac = function(query, callback) {
    query = query || {};
    chrome.proxy.settings.get(query, callback);
};

window.applyPac = function(script, callback) {
    chrome.proxy.settings.set({
        value: {
            mode: 'pac_script',
            pacScript: {
                data: script
            }
        },
        scope: 'regular'
    }, callback);
};

window.applyPacUrl = function(url, callback) {
    chrome.proxy.settings.set({
        value: {
            mode: 'pac_script',
            pacScript: {
                url: url
            }
        },
        scope: 'regular'
    }, callback);
};

window.clearPac = function(callback) {
    chrome.proxy.settings.clear({
        scope: 'regular'
    }, callback);
}
