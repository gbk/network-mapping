/* 
* @Author: caoke
* @Date:   2015-08-16 20:32:50
* @Last Modified by:   caoke
* @Last Modified time: 2015-10-06 23:54:22
*/

'use strict';

module.exports = function(me) {

    // exports json config
    me.exportJson = function() {
        var json = angular.toJson({
            groups: me.groups,
            groupSeq: me.groupSeq
        }, true);
        me.jsonDataUri = makeDataUri('application/json', json);
    };

    // exports hosts file
    me.exportHosts = function() {
        var hosts = '##\n## ' + Date.now();
        me.hostsDataUri = makeDataUri('text/none', hosts);
    };

    // exports pac file
    me.exportPacFile = function(direct) {
        var enabledNodes = me._findEnabledNodes(me.groups);
        var script = 'function FindProxyForURL(url,host){\n  if(isPlainHostName(host)) return "DIRECT";';
        enabledNodes.forEach(function(node) {
            var comparation;
            if (node.type === 0) {
                comparation = 'host=="' + node.rule + '"';
            } else {
                comparation = 'RegExp("' + node.rule + '").test(url)';
            }
            script += '\n  else if(' + comparation + ') return "PROXY ' + node.ip + '; DIRECT";';
        });
        script += '\n  else return "DIRECT";\n}';
        if (direct) {
            return script;
        } else {
            me.pacFileDataUri = makeDataUri('text/javascript', script);
        }
    };

    // upload file
    me.importFile = function() {
        chrome.tabs.create({
            url: chrome.runtime.getURL('./upload.html')
        });
    };
};

function makeDataUri(mime, str) {
    return 'data:' + mime + ',' + encodeURIComponent(str);
}
