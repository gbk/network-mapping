/* 
* @Author: caoke
* @Date:   2014-06-27 23:02:08
* @Last Modified by:   caoke
* @Last Modified time: 2015-10-06 23:15:55
*/

'use strict';

var instances = {};

window.testIfChanged = function(key, value) {
    value = JSON.stringify(value);
    if (instances[key] !== value) {
        instances[key] = value;
        return true;
    }
    return false;
};

window.set = function(key, value, serialized) {
    if (key !== undefined && value !== undefined) {
        if (!serialized) {
            value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
    }
};

window.get = function(key) {
    var value = localStorage.getItem(key);
    if (value !== undefined) {
        return JSON.parse(value);
    }
};
