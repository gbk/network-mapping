/* 
* @Author: caoke
* @Date:   2015-06-07 22:32:50
* @Last Modified by:   caoke
* @Last Modified time: 2015-10-07 16:04:44
*/

'use strict';

require('../styles/index.less');

var Storage = require('./storage');
var Dialog = require('./dialog');
var Tab = require('./tab');
var Group = require('./group');
var Utils = require('../../lib/utils');
var Exports = require('./exports');
var Settings = require('./settings');
var Watch = require('./watch');

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
