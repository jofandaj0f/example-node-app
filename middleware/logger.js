'use strict';

const expressWinston = require('express-winston');
const winston = require('winston');

winston.emitErrs = true;

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'error',
            filename: './watchtops.log',
            handleExceptions: true,
            json: false,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false,
            timestamp:true
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
            timestamp:true
        })
    ],
    exitOnError: false
});

module.exports = logger
module.exports.stream = {
    write: function(message, encoding) {
        logger.info(message);
    }
};
