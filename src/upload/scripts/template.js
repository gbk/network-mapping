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