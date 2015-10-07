/* 
* @Author: caoke
* @Date:   2015-06-07 22:32:50
* @Last Modified by:   caoke
* @Last Modified time: 2015-10-06 23:32:23
*/

'use strict';

var bg = chrome.extension.getBackgroundPage();

module.exports = function(me, scope) {
    scope.$watch('c.search', function(search) {
        me.groups.forEach(function(group) {
            searchNodes(group.nodes, search);
        });
        bg.set('search', search);
        bg.set('searchCurrent', me.searchCurrent);
    });
    scope.$watch('c.groups', function (newValue) {
        var oTags = {};
        var aTags = [];
        newValue.forEach(function(group) { // each group
            group.tags.split(',').forEach(function(tag) { // each tag
                tag = tag.replace(/(^\s+)|(\s+$)/g, ''); // trim
                if (tag) {
                    oTags[tag] = oTags[tag] || {
                        name: tag,
                        active: group.show
                    };
                    oTags[tag].active = oTags[tag].active && group.show;
                }
            });
        });
        for (var tag in oTags) {
            aTags.push(oTags[tag]);
        }
        me.tags = aTags;
        var enabledNodes = me._findEnabledNodes(newValue);
        if (bg.testIfChanged('enabledNodes', enabledNodes)) {
            bg.applyPac(me.exportPacFile(true));
        }
        bg.set('groups', angular.toJson(newValue), true);
        bg.set('groupSeq', me.groupSeq);
    }, true);

    // find enabled nodes in all groups
    me._findEnabledNodes = function(groups) {
        var nodes = [];
        groups.forEach(function(group) {
            group.nodes.forEach(function(node) {
                if (node.enable) {
                    nodes.push({
                        ip: node.ip,
                        rule: node.rule,
                        type: node.type
                    });
                }
            });
        });
        return nodes;
    };
};

function searchNodes(nodes, keywords) {
    if (keywords) { // has search keywords
        nodes.forEach(function(node) {
            node.show = !!(
                node.ip && node.ip.indexOf(keywords) !== -1 ||
                node.rule && node.rule.indexOf(keywords) !== -1 ||
                node.comment && node.comment.indexOf(keywords) !== -1
            );
        });
    } else { // no search keywords
        nodes.forEach(function(node) {
            node.show = true;
        });
    }
}
