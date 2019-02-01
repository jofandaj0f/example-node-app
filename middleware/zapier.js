'use strict'

var request = require("request");
var logger = require("./logger");

var zapier = {
  WebHook: function(body,option){
    // logger.info(body);
    var url;
    if(option === 'zoho'){
      url = process.env.ZAPZOHO;
    }
    else if (option === 'sheets'){
      url = process.env.ZAPSHEETS;
    }
    else if (option === 'mongo'){
      url = process.env.ZAPMONGO;
    }
    var options = { method: 'POST',
      url: process.env.ZAPZOHO,
      body: body,

      headers:
       {
         'Cache-Control': 'no-cache',
          'Content-Type': 'application/json' },
      json: true
    };
    // Do async job
     request(options, function(err, resp, body) {
         if (err) throw err;
         logger.info(body);
     });
  }
};

module.exports = zapier;
