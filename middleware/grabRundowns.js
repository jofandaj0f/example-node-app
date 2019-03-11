'use strict'
require('dotenv').config();
const enps = require('./enps');
const logger = require('./logger');
const mongo = require('./mongoclient');
const zapier = require('./zapier');
const assert = require('assert');

var grabRundowns = {
  run: function(enpsFolder, fileExtension) {
    enps.logon(process.env.ENPS_HOST, process.env.ENPS_USER, process.env.ENPS_PASS, process.env.ENPS_DOMAIN, process.env.ENPS_DEVKEY)
      .then(function(data) {
        var preDate = "20" + fileExtension.substring(0, 8);
        logger.info(preDate);
        var session = data.SessionID;
        var MyDate = new Date("20" + fileExtension.substring(0, 8));
        var MyDateString;
        MyDate.setDate(MyDate.getDate() + 2);
        MyDateString = MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth()+1)).slice(-2) + '-' + ('0' + MyDate.getDate()).slice(-2);
        logger.info(MyDateString);
        enps.listRundowns(process.env.ENPS_HOST, data.SessionID, {
          "Database": process.env.ENPS_DB,
          "ENPSListParameters": [{
            "Path": "P_" + enpsFolder + "\\W",
            "Guid": "",
            "Type": 2,
            "StartTime": preDate + "T05:00:00.000Z",
            "EndTime": MyDateString + "T05:00:00.000Z",
            "Priority": null,
            "UnreadBy": ""
          }]
        }).then(function(data) {
          logger.info('There are', data.length, 'Rundowns');
          for (var i = 0; i < data.length; i++) {
            var insertTitle = data[i].title;
            var optionsRO = {
              database: process.env.ENPS_DB,
              path: 'P_' + enpsFolder + '\\W',
              guid: data[i]["guid"], //"BA7AF919-D626-4543-ABE9D664277B146A",
              hitHighlightTerm: '',
              returnText: 'false'
            };
            enps.getROContent(process.env.ENPS_HOST, session, optionsRO)
              .then(function(data2) {
                //BREAKDOWN each page from the rundown
                //PUSH Array of objects of Pages to Mongos
                if (data2.length > 1) {
                  var err = optionsRO.guid + ' === ' + insertTitle + ' === ' + data2;
                  throw new Error(err);
                }
                var rundownName = data2["ListData"]["ModTime"].substring(0, 10) + ' ' + data2["ListData"]["Title"];
                var myArray = [];
                if (data2.CollectionScripts.length > 50) {
                  for (var i = 0; i < data2.CollectionScripts.length; i++) {
                    var breakdown = data2.CollectionScripts[i].RecordPointer.ObjectProperties;
                    var obj = {};
                    for (var j = 0; j < breakdown.length; j++) {
                      var sto1 = breakdown[j].FieldName;
                      var sto2 = breakdown[j].FieldValue;
                      obj[sto1] = sto2;
                    }
                    myArray.push(obj);
                  };
                  logger.info(rundownName + ' is ' + myArray.length + ' Pages long.');
                  mongo.insertDocs(myArray, rundownName, "Rundowns");
                }
              }).catch(function(err) {
                // getROContent End
                logger.error('Get Rundown Error: ', err);
                logger.error(optionsRO);
                zapier.WebHook(err, 'mail');
              });
          }
        }).catch(function(err) {
          // ListRundowns End
          logger.error(err);
          zapier.WebHook(err, 'mail');
        });
      }).catch(function(err) {
        //Logon End
        logger.error(err);
        zapier.WebHook(err, 'mail');
      });
  },
  runGrid: function(enpsFolder, fileExtension) {
    enps.logon(process.env.ENPS_HOST, process.env.ENPS_USER, process.env.ENPS_PASS, process.env.ENPS_DOMAIN, process.env.ENPS_DEVKEY)
      .then(function(data) {
        var session = data.SessionID;
        logger.info('Session:', session, "20" + fileExtension.substring(0, 8), enpsFolder);
        enps.listRundowns(process.env.ENPS_HOST, session, {
          "Database": process.env.ENPS_DB,
          "ENPSListParameters": [{
            "Path": "P_" + enpsFolder + "\\W",
            "Guid": "",
            "Type": 12,
            "StartTime": "20" + fileExtension.substring(0, 8) + "T00:00:00.000Z",
            "EndTime": "20" + fileExtension.substring(0, 8) + "T23:59:59.000Z",
            "Priority": null,
            "UnreadBy": ""
          }]
        }).catch(function(err) {
          logger.info(err);
        }).then(function(dataTwo) {
          // logger.info(dataTwo);
          for (var i = 0; i < dataTwo.length; i++) {
            logger.info('Get planningGrid', dataTwo[i]['guid']);
            enps.getPlanningContent(process.env.ENPS_HOST, session, {
              "database": process.env.ENPS_DB,
              "path": 'P_' + enpsFolder + '\\W',
              "guid": dataTwo[i]['guid'],
              "hitHighlightTerm": '',
              "returnText": 'true'
            }).then(function(dataThree) {
              //BREAKDOWN each page from the rundown
              //PUSH Array of objects of Pages to Mongos
              var rundownName = dataThree["ListData"]["Title"] + ' ' + dataThree["ListData"]["ModTime"].substring(0, 10);
              var myArray = [];
              for (var i = 0; i < dataThree.CollectionScripts.length; i++) {
                var breakdown = dataThree.CollectionScripts[i].RecordPointer.ObjectProperties;
                var obj = {};
                for (var j = 0; j < breakdown.length; j++) {
                  var sto1 = breakdown[j].FieldName;
                  var sto2 = breakdown[j].FieldValue;
                  obj[sto1] = sto2;
                }
                myArray.push(obj);
              };
              logger.info('The Planning Grid is ' + myArray.length + ' Pages long.');
              mongo.insertDocs(myArray, rundownName, "planningGrids");
              logger.info(rundownName);
            }).catch(function(err) {
              logger.error(err);
              zapier.WebHook(err, 'mail');
            });
          }
        }).catch(function(err) {
          logger.error(err);
          zapier.WebHook(err, 'mail');
        });
      });
  },
  NewsNow: function(fileExtension) {
    enps.logon(process.env.ENPS_HOST, process.env.ENPS_USER, process.env.ENPS_PASS, process.env.ENPS_DOMAIN, process.env.ENPS_DEVKEY)
      .then(function(data) {
        var preDate = "20" + fileExtension.substring(0, 8);
        logger.info(preDate);
        var session = data.SessionID;
        var MyDate = new Date("20" + fileExtension.substring(0, 8));
        var MyDateString;
        MyDate.setDate(MyDate.getDate() + 2);
        MyDateString = MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth()+1)).slice(-2) + '-' + ('0' + MyDate.getDate()).slice(-2);
        logger.info(MyDateString);
        enps.listRundowns(process.env.ENPS_HOST, data.SessionID, {
          "Database": process.env.ENPS_DB,
          "ENPSListParameters": [{
            "Path": "P_WRNNNEWS\\W",
            "Guid": "",
            "Type": 2,
            "StartTime": preDate + "T05:00:00.000Z",
            "EndTime": MyDateString + "T05:00:00.000Z",
            "Priority": null,
            "UnreadBy": ""
          }]
        }).then(function(data) {
          logger.info('There are', data.length, 'Rundowns');
          for (var i = 0; i < data.length; i++) {
            var insertTitle = data[i].title;
            logger.info(insertTitle);
            if (insertTitle === 'HD FiOS1 News Now'){
              var optionsRO = {
                database: process.env.ENPS_DB,
                path: 'P_WRNNNEWS\\W',
                guid: data[i]["guid"], //"BA7AF919-D626-4543-ABE9D664277B146A",
                hitHighlightTerm: '',
                returnText: 'false'
              };
              logger.info('HD News Now found');
              enps.getROContent(process.env.ENPS_HOST, session, optionsRO)
                .then(function(data2) {
                  //BREAKDOWN each page from the rundown
                  //PUSH Array of objects of Pages to Mongos
                  if (data2.length > 1) {
                    var err = optionsRO.guid + ' === ' + insertTitle + ' === ' + data2;
                    throw new Error(err);
                  }
                  var rundownName = data2["ListData"]["ModTime"].substring(0, 10) + ' ' + data2["ListData"]["Title"];
                  var myArray = [];
                  if (data2.CollectionScripts.length > 50) {
                    for (var i = 0; i < data2.CollectionScripts.length; i++) {
                      var breakdown = data2.CollectionScripts[i].RecordPointer.ObjectProperties;
                      var obj = {};
                      for (var j = 0; j < breakdown.length; j++) {
                        var sto1 = breakdown[j].FieldName;
                        var sto2 = breakdown[j].FieldValue;
                        obj[sto1] = sto2;
                      }
                      myArray.push(obj);
                    };
                    logger.info(rundownName + ' is ' + myArray.length + ' Pages long.');
                    mongo.insertDocs(myArray, rundownName, "Rundowns");
                  }
                }).catch(function(err) {
                  // getROContent End
                  logger.error('Get Rundown Error: ', err);
                  logger.error(optionsRO);
                  zapier.WebHook(err, 'mail');
                });
            }
          }
        }).catch(function(err) {
          // ListRundowns End
          logger.error(err);
          zapier.WebHook(err, 'mail');
        });
      }).catch(function(err) {
        //Logon End
        logger.error(err);
        zapier.WebHook(err, 'mail');
      });
  }

};

module.exports = grabRundowns;
