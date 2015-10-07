/* 
* @Author: caoke
* @Date:   2015-06-07 22:32:50
* @Last Modified by:   caoke
* @Last Modified time: 2015-10-06 20:34:30
*/

'use strict';

var bg = chrome.extension.getBackgroundPage();

module.exports = function(me) {
    me.version = chrome.runtime.getManifest().version;
    me.tags = [];
    me.groups = bg.get('groups') || [
        {
            id: 0,
            name: 'Default',
            nodes: [],
            tags: '',
            show: true,
            expand: true
        }
    ];
    me.groupSeq = bg.get('groupSeq') || 1;
    me.searchCurrent = !!bg.get('searchCurrent');
    if (me.searchCurrent) {
        me.searchCurrentHostname();
    } else {
        me.search = bg.get('search') || '';
    }
    me.dialog = null;
};
