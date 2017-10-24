'use strict';

const mysql = require('mysql');
const config = require('../config');
const logger = require('./logger');
const async = require('async');


var conn = mysql.createConnection(config.db_config);

conn.connect(function(err) {
    if (!err) {
        logger.info("Database is connected ...");
    } else {
        logger.error("Error connecting database ...");
    }
});

function Connection() {
    conn.on('error', function(err) {
        logger.error(err);
    });
    conn.on('close', function(err) {
        if (err) {
            logger.error('Connection closed Unexpectedly. Attempting to Recover...');
            //connection = mysql.createConnection(config.db_config);
        } else {
            logger.info('Connection closed normally.');
        }
    });
};

Connection.prototype.execute = function(msg) {
    return new Promise(function(resolve, reject) {
        //logger.info('Start Promise ' + msg);
        //logger.info('Create Connection ' + msg);
        //var connection = mysql.createConnection(config.db_config);
        logger.debug('Async CAPTURED msg VAR: ' + msg);
        var json = [];
        conn.query(msg, function(error, rows, fields) {
            logger.debug('ROWS ARE HERE: ' + rows);
            if (!error) {
                for (var i = 0; i < rows.length; i++) {
                    json.push(rows[i]);
                }
            } else if (error) {
                json.push('Null response from MySQL');
            }
            conn.on('error', function(err) {
                logger.error('There is an Error: ' + err);
            });
            //logger.debug(json);
            conn.end(function(err) {
                      if (err) throw err;
                      logger.debug('Connection Terminated');
                  });
            resolve(json);
            // connected!
        });
    });
};

module.exports = Connection; 
