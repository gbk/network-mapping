/* 
* @Author: caoke
* @Date:   2015-10-05 21:31:08
* @Last Modified by:   caoke
* @Last Modified time: 2015-10-05 23:18:39
*/

'use strict';

var processor = require('./processor');

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