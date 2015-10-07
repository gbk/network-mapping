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
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	/* 
	* @Author: caoke
	* @Date:   2015-10-05 00:59:14
	* @Last Modified by:   caoke
	* @Last Modified time: 2015-10-05 23:18:00
	*/

	'use strict';

	__webpack_require__(24);

	__webpack_require__(26);
	__webpack_require__(27);


/***/ },

/***/ 21:
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

/***/ 24:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 26:
/***/ function(module, exports) {

	/* 
	* @Author: caoke
	* @Date:   2015-10-05 21:29:31
	* @Last Modified by:   caoke
	* @Last Modified time: 2015-10-05 21:29:47
	*/

	'use strict';

	document.title = 'Import';

	document.body.innerHTML = [
	    '<div class="uploader" id="J_DropHolder">',
	        '<div class="tips">',
	            '<div>Drop File Here</div>',
	            '<div class="or">or</div>',
	        '</div>',
	        '<div class="button">',
	            '<span>Select File</span>',
	            '<input type="file" class="file" id="J_File">',
	        '</div>',
	        '<div class="accepts">',
	            'Supported formats: json、hosts、pac.',
	            '<br/>',
	            'File size should be between 8B to 1MB.',
	        '</div>',
	    '</div>'
	    ].join('');

/***/ },

/***/ 27:
/***/ function(module, exports, __webpack_require__) {

	/* 
	* @Author: caoke
	* @Date:   2015-10-05 21:31:08
	* @Last Modified by:   caoke
	* @Last Modified time: 2015-10-05 23:18:39
	*/

	'use strict';

	var processor = __webpack_require__(28);

	var holder = document.getElementById('J_DropHolder');
	var file = document.getElementById('J_File');

	// DND events
	holder.addEventListener('dragenter', function(e) {
	    holder.classList.add('drag');
	}, false);

	holder.addEventListener('dragleave', function(e) {
	    if (e.target === holder) {
	        holder.classList.remove('drag');
	    }
	}, false);

	holder.addEventListener('dragover', function(e) {
	    e.preventDefault();
	}, false);

	holder.addEventListener('drop', function(e) {
	    e.preventDefault();
	    holder.classList.remove('drag');
	    readFile(e.dataTransfer.files);
	}, false);

	file.addEventListener('change', function() {
	    readFile(file.files);
	}, false);

	// FileReader api
	function readFile(files) {
	    if (files && checkFile(files[0])) {
	        var ext = files[0].name.split('.').pop();
	        var reader = new FileReader();
	        reader.onload = function(e) {
	            processor(ext, e.target.result);
	        };
	        reader.onerror = function(e) {
	            alert('Please select a valid file.');
	        }
	        reader.readAsText(files[0]);
	    }
	}

	// check if valid file
	function checkFile(file) {
	    if (!file) {
	        alert('Please select a valid file.');
	        return false;
	    }
	    if (file.size < 8 || file.size > 1048576) {
	        alert('File size should be between 8B to 1MB.');
	        return false;
	    }
	    if (!/(\.json|^hosts|\.pac)$/.test(file.name)) {
	        alert('Supported formats: json、hosts、pac.');
	        return false;
	    }
	    return true;
	}

/***/ },

/***/ 28:
/***/ function(module, exports, __webpack_require__) {

	/* 
	* @Author: caoke
	* @Date:   2015-10-05 21:34:07
	* @Last Modified by:   caoke
	* @Last Modified time: 2015-10-05 23:22:52
	*/

	'use strict';

	var REG_QUOTE = /^#+\s*/;

	var Utils = __webpack_require__(21);

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


/***/ }

/******/ });