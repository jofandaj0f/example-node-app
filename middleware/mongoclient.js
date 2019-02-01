'use strict'

var logger = require('./logger');
var MongoClient = require('mongodb').MongoClient;
const assert = require('assert');



var uri = "mongodb://localhost:27017";

var mongo = {
  testConnection : function(){
    MongoClient.connect(uri, function(err, client) {
      if (err) throw err;
       const collection = client.db("reports").collection("AsRuns");
       // perform actions on the collection object
       client.close();
    });
  }
};

module.exports = mongo;
