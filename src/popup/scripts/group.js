/* 
* @Author: caoke
* @Date:   2015-06-07 22:32:50
* @Last Modified by:   caoke
* @Last Modified time: 2015-10-04 23:44:03
*/

'use strict';

module.exports = function(me) {
    me.isGroupEnable = function(group) {
        var enableSize = group.nodes.filter(function(n) {
            return n.enable;
        }).length;
        var nodeSize = group.nodes.length;
        return nodeSize > 0 && enableSize == nodeSize;
    };

    me.toggleGroupEnable = function(group) {
        var enable = !me.isGroupEnable(group);
        group.nodes.forEach(function(n) {
            n.enable = enable;
        });
    };

    me.filterTag = function(tag) {
        me.groups.filter(function(group) {
            return group.tags.split(',').indexOf(tag.name) !== -1;
        }).forEach(function(group) {
            group.show = !tag.active;
        });
    }
};
