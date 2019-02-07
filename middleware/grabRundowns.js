'use strict'
require('dotenv').config();
const enps = require('./enps');
const logger = require('./logger');
const mongo = require('./mongoclient');

var grabRundowns = {
  run : function(fileExtension){
    enps.logon(process.env.ENPS_HOST, process.env.ENPS_USER, process.env.ENPS_PASS, process.env.ENPS_DOMAIN, process.env.ENPS_DEVKEY)
    .then(function(data){
      //logger.info(data.SessionID);
      var session = data.SessionID;
      enps.listRundowns(process.env.ENPS_HOST, data.SessionID, {
          "Database": process.env.ENPS_DB,
          "ENPSListParameters": [{
            "Path": "P_"+fileExtension+"\\W",
            "Guid": "",
            "Type": 2,
            "StartTime": "2019-02-06T00:00:00.000Z",
            "EndTime": "2019-02-06T23:59:59.000Z",
            "Priority": null,
            "UnreadBy": ""
          }]
        }).then(function(data){
          for (var i = 0; i < data.length; i++){
            enps.getROContent(process.env.ENPS_HOST, session, {
              database: process.env.ENPS_DB,
              path: 'P_'+fileExtension+'\\W',
              guid: data[i]["guid"],
              hitHighlightTerm: '',
              returnText: 'true'})
            .then(function(data2){
              //BREAKDOWN each page from the rundown
              //PUSH Array of objects of Pages to Mongos
              var rundownName = data2["ListData"]["Title"] + ' ' + data2["ListData"]["ModTime"].substring(0,10);
              var myArray = [];
              for (var i=0; i<data2.CollectionScripts.length; i++){
                var breakdown = data2.CollectionScripts[i].RecordPointer.ObjectProperties;
                var obj = {};
                for (var j=0; j<breakdown.length; j++){
                  var sto1 = breakdown[j].FieldName;
                  var sto2 = breakdown[j].FieldValue;
                  obj[sto1] = sto2;
                }
                myArray.push(obj);
              };
              logger.info('The Rundown is ' + myArray.length + ' Pages long.');
              logger.info(rundownName);
              mongo.insertDocs(myArray, rundownName, "Rundowns");
            }).catch(function(err){
              logger.error('Get Rundown Error: ', err);
            });
          }
        });
    });
  }

};

module.exports = grabRundowns;
