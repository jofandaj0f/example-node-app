'use strict'
//Ingest Node MySQL, Node App Configs, and Logger for logging
const mysql = require('mysql');
const config = require('../config');
const logger = require('./logger');

var pool = mysql.createPool(config.pool_config);
//Runs a Test pool connection to establish with the db.
//For some reason if I delete this, the scope of the poolVision
//Object does not allow Pool connections to be created in that object.
//Primary object with the jumpinthepool function
//API's use this to call MYSQL.
var poolVision = {
  jumpinthepool: function(msg){
    //logger.debug('Ingest Message: ', msg);
    return new Promise(function(resolve, reject) {

        pool.getConnection(function(err, conn){
          logger.debug('Thread ID: ' + conn.threadId);
          //logger.debug('The message is ', msg);
          if(err) {
            return logger.error(err);
          } else {
            conn.query(msg, function(error, rows, fields) {
              //if (error) throw error;
              if (error) {
                return error;
              } else {
                //logger.debug('I received rows from SQL: ' + JSON.stringify(rows));
                if (!rows) {
                    reject('Empty response from SQL');
                } else {
                    //logger.info(rows);
                    resolve(rows);
                    //send rows to the callback
                }
              }
              conn.on('error', function(err) {
                if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
                    logger.error(err.code, 'Awww shit a timeout');
                    //setInterval(jumpinthepool(msg), 30000); // lost due to either server restart, or a
                } else { // connnection idle timeout (the wait_timeout
                    throw err; // server variable configures this)
                }
              });
              conn.release(function(err){
                if (err) throw err;
              });
            });
          }
        });
    });
  }
};

module.exports = poolVision;
