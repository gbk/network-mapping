/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* 
	* @Author: caoke
	* @Date:   2015-06-07 22:32:50
	* @Last Modified by:   caoke
	* @Last Modified time: 2015-10-07 16:04:44
	*/

	'use strict';

	__webpack_require__(11);

	var Storage = __webpack_require__(15);
	var Dialog = __webpack_require__(16);
	var Tab = __webpack_require__(19);
	var Group = __webpack_require__(20);
	var Utils = __webpack_require__(21);
	var Exports = __webpack_require__(22);
	var Settings = __webpack_require__(29);
	var Watch = __webpack_require__(23);

	var app = angular.module('app', [], function($compileProvider) {
	    $compileProvider.aHrefSanitizationWhitelist(/.*/);
	});
	app.controller('Ctrl', function($scope) {
	    var me = this;
	    Dialog(me);
	    Tab(me, $scope);
	    Group(me);
	    for (var key in Utils) {
	        me[key] = Utils[key];
	    }
	    Exports(me);
	    Settings(me, $scope);
	    Storage(me);
	    Watch(me, $scope);
	});


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */
/***/ function(module, exports) {

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


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* 
	* @Author: caoke
	* @Date:   2015-06-07 22:32:50
	* @Last Modified by:   caoke
	* @Last Modified time: 2015-10-07 21:50:34
	*/

	'use strict';

	var FORMS = __webpack_require__(17);
	var MODELS = __webpack_require__(18);

	module.exports = function(me) {
	    me.formDialog = function(type, model, extend) {
	        var lType = type.toLowerCase();
	        var form = FORMS[lType];
	        var newModel = model || angular.extend({}, extend, MODELS[lType]);
	        form.forEach(function(field) {
	            if (field.name in newModel) {
	                field.value = newModel[field.name];
	            } else {
	                field.value = field.defaultValue;
	            }
	        });
	        me.dialog = {
	            title: me.i18n((model ? 'edit' : 'add') + type),
	            form: form,
	            confirm: function() {
	                var groupChange = false;
	                form.forEach(function(field) {
	                    if (field.name == 'group' && newModel.group != field.value) {
	                        groupChange = {
	                            'old': newModel.group,
	                            'new': field.value
	                        };
	                    }
	                    newModel[field.name] = field.value;
	                });
	                // create new model if not exist
	                if (!model) {
	                    switch (type) {
	                    case 'Group':
	                        newModel.id = me.groupSeq++;
	                        me.groups.push(newModel);
	                        break;
	                    case 'Node':
	                        var group = me.groups.filter(function(g) {
	                            return g.id == newModel.group;
	                        })[0];
	                        group && group.nodes.push(newModel);
	                        break;
	                    }
	                } else if (groupChange) {
	                    var groupOld = me.groups.filter(function(g) {
	                        return g.id == groupChange['old'];
	                    })[0];
	                    if (groupOld) {
	                        var index = groupOld.nodes.indexOf(newModel);
	                        groupOld.nodes.splice(index, 1);
	                        var groupNew = me.groups.filter(function(g) {
	                            return g.id == groupChange['new'];
	                        })[0];
	                        groupNew && groupNew.nodes.push(newModel);
	                    }
	                }
	                me.dialog = null;
	            }
	        }
	    };

	    me.confirmDialog = function(type) {
	        switch (type) {
	        case 'deleteGroup':
	            var array = arguments[1];
	            var index = arguments[2];
	            me.dialog = {
	                title: me.i18n(type),
	                message: me.i18n(type + 'Tip', array[index].name),
	                confirm: function() {
	                    array.splice(index, 1);
	                    me.dialog = null;
	                }
	            };
	            break;
	        case 'deleteNode':
	            var array = arguments[1];
	            var index = arguments[2];
	            me.dialog = {
	                title: me.i18n(type),
	                message: me.i18n(type + 'Tip'),
	                confirm: function() {
	                    array.splice(index, 1);
	                    me.dialog = null;
	                }
	            };
	            break;
	        case 'donate':
	            me.dialog = {
	                title: me.i18n(type),
	                image: 'data:image/jpg;base64,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',
	                message: [
	                    me.i18n(type + 'Tip1'),
	                    me.i18n(type + 'Tip2'),
	                    me.i18n(type + 'Tip3')
	                ],
	                confirm: function() {
	                    me.dialog = null;
	                }
	            };
	            break;
	        }
	    };
	};


/***/ },
/* 17 */
/***/ function(module, exports) {

	/* 
	* @Author: caoke
	* @Date:   2015-06-07 22:32:50
	* @Last Modified by:   caoke
	* @Last Modified time: 2015-10-04 23:41:43
	*/

	'use strict';

	module.exports = {
	    group: [
	        {
	            name: 'name',
	            label: 'Name',
	            type: 'text',
	            defaultValue: ''
	        },
	        {
	            name: 'tags',
	            label: 'Tags',
	            type: 'text',
	            defaultValue: ''
	        }
	    ],
	    node: [
	        {
	            name: 'group',
	            label: 'Group',
	            type: 'select',
	            multiple: false,
	            options: 'groups',
	            defaultValue: 0
	        },
	        {
	            name: 'ip',
	            label: 'IP',
	            type: 'text',
	            defaultValue: ''
	        },
	        {
	            name: 'type',
	            label: 'Rule Type',
	            type: 'select',
	            multiple: false,
	            options: [
	                {
	                    id: 0,
	                    name: 'Domain'
	                },
	                {
	                    id: 1,
	                    name: 'RegExp'
	                }
	            ],
	            defaultValue: 0
	        },
	        {
	            name: 'rule',
	            label: 'Rule',
	            type: 'text',
	            defaultValue: ''
	        },
	        {
	            name: 'comment',
	            label: 'Comment',
	            type: 'text',
	            defaultValue: ''
	        }
	    ]
	};


/***/ },
/* 18 */
/***/ function(module, exports) {

	/* 
	* @Author: caoke
	* @Date:   2015-06-07 22:32:50
	* @Last Modified by:   caoke
	* @Last Modified time: 2015-10-04 23:44:33
	*/

	'use strict';

	module.exports = {
	    group: {
	        name: '',
	        nodes: [],
	        tags: '',
	        show: true,
	        expand: true
	    },
	    node: {
	        type: 0,
	        ip: '',
	        rule: '',
	        comment: '',
	        enable: false,
	        show: true
	    }
	};


/***/ },
/* 19 */
/***/ function(module, exports) {

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


/***/ },
/* 20 */
/***/ function(module, exports) {

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


/***/ },
/* 21 */
/***/ function(module, exports) {

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


/***/ },
/* 22 */
/***/ function(module, exports) {

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


/***/ },
/* 23 */
/***/ function(module, exports) {

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


/***/ },
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);