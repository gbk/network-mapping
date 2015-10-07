/* 
* @Author: caoke
* @Date:   2015-10-05 22:40:28
* @Last Modified by:   caoke
* @Last Modified time: 2015-10-07 16:50:28
*/

'use strict';

exports.trim = function(str) {
    return str.replace(/(^\s+)|(\s+$)/g, '');
};

exports.i18n = function(key) {
    var args = Array.prototype.slice.call(arguments, 1);
    return chrome.i18n.getMessage(key, args);
}

exports.isValidIP = function(ip) {
    if (isIPv4(ip)) { // IPv4
        return true;
    } else if (ip.indexOf(':') !== -1) { // IPv6 (http://zh.wikipedia.org/wiki/IPv6)
        var parts = ip.split(':');
        if (ip.indexOf(':::') !== -1) {
            return false;
        } else if (ip.indexOf('::') !== -1) {
            if (!(ip.split('::').length === 2 || parts.length > 8)) {
                return false;
            }
        } else if (parts.length !== 8) {
            return false;
        }
        if (parts.length === 4 && isIPv4(parts[3])) {
            return parts[2] === 'ffff';
        } else {
            for (var i = 0; i < parts.length; i++) {
                if (!/^[0-9A-Za-z]{0,4}$/.test(parts[i])) {
                    return false;
                }
            }
            return !/(^:[^:])|([^:]:$)/g.test(ip);
        }
    } else {
        return false;
    }
};

function isIPv4(ip) {
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) {
        ip = ip.split('.');
        for (i = 0; i < ip.length; i++) {
            if (parseInt(ip[i]) > 255) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
};
