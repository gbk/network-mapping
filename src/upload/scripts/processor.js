/* 
* @Author: caoke
* @Date:   2015-10-05 21:34:07
* @Last Modified by:   caoke
* @Last Modified time: 2015-10-05 23:22:52
*/

'use strict';

var REG_QUOTE = /^#+\s*/;

var Utils = require('../../lib/utils');

var bg = chrome.extension.getBackgroundPage();

module.exports = function(ext, content) {
    try {
        switch (ext) {
            case 'json':
                return processJson(content);
            case 'hosts':
                return processHosts(content);
            case 'pac':
                return processPac(content);
        }
    } catch (e) {
        alert('Parse error: ' + e);
    }
};

function processJson(content) {

    // fetch
    var groups = bg.get('groups');
    var groupSeq = bg.get('groupSeq');

    // merge groups
    var json = JSON.parse(content);
    json.groups.forEach(function(group) {
        group.id = groupSeq++;
        groups.push(group);
    });

    // save
    bg.set('groups', groups);
    bg.set('groupSeq', groupSeq);
}

function processHosts(content) {

    // temp nodes
    var nodes = [];

    // split to lines
    content.split(/\r?\n/).forEach(function(line) {

        // trim
        line = Utils.trim(line);

        // a valid line
        if (/^#*\s*[0-9A-Za-z:\.]+\s+[^#]+/.test(line)) {

            // temp node
            var node = {
                type: 0,
                comment: '',
                show: true
            };

            // test if enable
            node.enable = !REG_QUOTE.test(line);
            if (!node.enable) {
                line.replace(REG_QUOTE, '');
            }

            // test if has comment
            var index = line.indexOf('#');
            if (index !== -1) {
                node.comment = Utils.trim(line.substring(index).replace(REG_QUOTE, ''));
            }

            // test if valid ip domain
            var patterns = line.split(/\s+/);
            if (patterns.length > 1 && Utils.isValidIP(patterns[0])) {
                node.ip = patterns[0];
                node.rule = patterns[1];
                nodes.push(node);

                // one ip to multi domains
                for (var i = 2; i < patterns.length; i++) {
                    nodes.push({
                        type: 0,
                        show: true,
                        comment: node.comment,
                        enable: node.enable,
                        ip: node.ip,
                        rule: node.rule
                    });
                }
            }
        }
    });

    // has data
    if (nodes.length) {

        // fetch
        var groups = bg.get('groups');
        var groupSeq = bg.get('groupSeq');

        // import from hosts
        groups.push({
            id: groupSeq++,
            name: 'Import from hosts',
            nodes: nodes,
            tags: '',
            show: true,
            expand: true
        });

        // save
        bg.set('groups', groups);
        bg.set('groupSeq', groupSeq);
    }
}

function processPac(content) {
    alert('developing');
}
