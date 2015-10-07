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
