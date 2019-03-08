'use strict'
require('dotenv').config();
var logger = require('./logger');
var MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var username = process.env.MONGO_USER;
var password = process.env.MONGO_PW;
var site = process.env.MONGO_SITE;
var uri = "mongodb+srv://" + username + ":" + password + site;

var mongo = {
  testConnection: function() { 
    MongoClient.connect(uri, function(err, client) {
      if (err) throw err;
      const collection = client.db("AsRuns");
      logger.info('Test Connected');
      // perform actions on the collection object
      client.close();
    });
  },
  insertDocs: function(doc, p, database) {
    const insertDocuments = function(db, callback) {
      // Get the documents collection
      const collection = db.collection(p);
      // Insert some documents
      // Example Many[{a : 1}, {a : 2}, {a : 3}]
      collection.insertMany(doc, function(err, result) {
        assert.equal(err, null);
        assert.equal(doc.length, result.result.n);
        assert.equal(doc.length, result.ops.length);
        logger.info("Inserted " + doc.length + " documents into the collection");
        callback(result);
      });
    }
    // Use connect method to connect to the server
    MongoClient.connect(uri, function(err, client) {
      assert.equal(null, err);
      logger.info("Connected successfully to server", doc[0].Title);

      const db = client.db(database);

      insertDocuments(db, function() {
        assert.equal(err, null);
        logger.info("Connection Closed", doc[0].Title);
        client.close();
      });
    });
  }
};

module.exports = mongo;
