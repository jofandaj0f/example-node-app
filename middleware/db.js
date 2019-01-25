'use strict';

var db = require('node-mysql');
var DB = db.DB;
var BaseRow = db.Row;
var BaseTable = db.Table;
const config = require('../config');
const logger = require('./logger');

var box = new DB({
    host     : 'slicer-ctrl.rnntv.com',
    user     : 'rnntv',
    password : 'ryebrook',
    database : 'asruns'
});

box.connect(function(conn, cb) {
        cps.seq([
            function(_, cb) {
                conn.query('select * from users limit 1', cb);
            },
            function(res, cb) {
                console.log(res);
                cb();
            }
        ], cb);
    }, cb);

module.exports = basicTest;
