/* 
* @Author: caoke
* @Date:   2015-08-16 20:32:50
* @Last Modified by:   caoke
* @Last Modified time: 2015-10-07 22:40:12
*/

'use strict';

var bg = chrome.extension.getBackgroundPage();

module.exports = function(me, scope) {

    // query status when popup show
    queryPac();
    me.showIP = bg.queryShowIP();
    // me.pacUrl = bg.queryPacUrl();

    // toggle enable status
    me.toggleEnable = function() {
        if (me.proxyEnable) {
            bg.clearPac(queryPac);
        } else {
            bg.applyPac(me.exportPacFile(true), queryPac);
        }
    };

    // toggle show ip status
    me.toggleShowIP = function() {
        me.showIP = bg.toggleShowIP();
    };

    function queryPac() {
        bg.queryPac(null, function(cfg) {
            me.proxyEnable = cfg.levelOfControl === 'controlled_by_this_extension';
            scope.$apply();
        });
    }
};
