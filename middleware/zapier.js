'use strict'

var request = require("request");
var logger = require("./logger");

//Send an Array or Object as the "body" variable.
//"Option" variable is for selecting different Webhook URLs.
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
    else {
      return "Pass zoho, sheets or mongo as the second parameter in the function"
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
