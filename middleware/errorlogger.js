

    'use strict';
const winston = require('winston');
const expressWinston = require('express-winston');


// winston.emitErrs = true;

const errorlogger = expressWinston.errorLogger({
      transports: [
        new winston.transports.Console()
      ],
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
      )
    });


module.exports = errorlogger;
module.exports.stream = {
    write: function(message, encoding) {
        logger.info(message);
    }
};