/* 
* @Author: caoke
* @Date:   2015-06-07 22:32:50
* @Last Modified by:   caoke
* @Last Modified time: 2015-10-06 20:36:39
*/

'use strict';

module.exports = function(me, scope) {
    me.open = function(url) {
        if (/^mailto:/.test(url)) {
            // try to open `mailto` url from an opened tab
            // to avoid remaining a blank tab
            chrome.tabs.executeScript(null, {
                code: 'location.href = "' + url + '"'
            }, function() {
                // if failed, create a new `mailto` tab
                if (chrome.runtime.lastError) {
                    chrome.tabs.create({
                        url: url
                    }, function(tab) {
                        // close the `mailto` blank tab after a while
                        setTimeout(function() {
                            chrome.tabs.remove(tab.id, function() {
                                // to avoid error log if remove failed
                                chrome.runtime.lastError;
                            });
                        }, 2000);
                    });
                }
            });
        } else {
            chrome.tabs.create({
                url: url
            });
        }
    };

    me.searchCurrentHostname = function() {
        chrome.tabs.getSelected(function(tab) {
            me.search = tab.url.split('/')[2] || '';
            me.searchCurrent = true;
            scope.$apply();
        });
    };

    me.bugReport = function() {
        var manifest = chrome.runtime.getManifest();
        var email = manifest.author.email;
        var subject = '[BugReport]' + me.i18n('appName');
        var body = '\n\nversion:' + manifest.version;
        body += '\nuserAgent:' + navigator.userAgent;
        body = encodeURIComponent(body);
        me.open('mailto:' + email + '?subject=' + subject + '&body=' + body);
    };
};
