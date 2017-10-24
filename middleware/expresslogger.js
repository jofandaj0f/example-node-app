'use strict';

const expressWinston = require('express-winston');
const winston = require('winston');

var expresslogger = new expressWinston.logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: './groot.log',
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
    statusLevels: true, //optional: Boolean or Object // different HTTP status codes caused log messages to be logged at different levels (info/warn/error), the default is false. Use an object to control the levels various status codes are logged at.
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function(req, res) {
        return false;
    }, // optional: allows to skip some log messages based on request and/or response
    exitOnError: false
})

module.exports = expresslogger
module.exports.stream = {
    write: function(message, encoding) {
        logger.info(message);
    }
};
