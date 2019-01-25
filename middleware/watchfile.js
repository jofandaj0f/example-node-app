'use strict'
var db = require('node-mysql');
var DB = db.DB;
var BaseRow = db.Row;
var BaseTable = db.Table;
var box = new DB({
    host     : 'slicer-ctrl.rnntv.com',
    user     : 'rnntv',
    password : 'ryebrook',
    database : 'asruns'
});

function watchFile() {
  this.func = function(data) {
    middleware.logger.info('Line: ' + data);
  };
  this.readLines = function(input, func) {
    var remaining = '';

   input.on('data', function(data) {
     remaining += data;
     var index = remaining.indexOf('\n');
     var last  = 0;
     while (index > -1) {
       var line = remaining.substring(last, index);
       last = index + 1;
       this.func(line);
       index = remaining.indexOf('\n', last);
     }

     remaining = remaining.substring(last);
   });

   input.on('end', function() {
     if (remaining.length > 0) {
       this.func(remaining);
     }
   });
  };
};

module.exports = watchFile;
