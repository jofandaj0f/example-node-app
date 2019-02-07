'use strict'
var request = require("request");
var logger = require('./logger');
var enps = {
  logon : function(serviceAddress, userName, password, domainName, devKey){
    //Logon
    var options = { method: 'GET',
      url: serviceAddress + '/api/Logon',
      qs:
       { staffUserId: userName,
         domainuserId: userName,
         password: password,
         domainName: domainName,
         devKey: devKey,
         iClientType: '9' },
      headers:
       {
         'Cache-Control': 'no-cache' }
       };
     // Return new promise
     return new Promise(function(resolve, reject) {
      // Do async job
         request.get(options, function(err, resp, body) {
             if (err) {
                 reject(err);
             } else {
                 // logger.info('enps.js : ', body);
                 resolve(JSON.parse(body));
             }
         });
     });
  },
  ping : function(serviceAddress, nomTokenId){
    //PING
    var options = { method: 'GET',
      url: serviceAddress + '/api/Ping',
      headers:
       { 'Cache-Control': 'no-cache',
         'X-ENPS-TOKEN': nomTokenId } };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      logger.info(body);
    });
  },
  search: function(serviceAddress, nomTokenId, database, location){
    logger.info('enps.js search: ', serviceAddress, nomTokenId, database, location);
    //SEARCH
    var options = { method: 'POST',
      url: serviceAddress + '/api/Search',
      headers:
       { 'Content-Type': 'application/json',
         'X-ENPS-TOKEN': nomTokenId },
      body:
       { Database: database,
         MaxRows: 200,
         ExactMatch: false,
         NOMContentTypes:
          { All: false,
            Audio: false,
            Contacts: false,
            Grids: false,
            Messages: false,
            NewsgatheringGrids: false,
            NewsgatheringItems: false,
            Pictures: false,
            Readins: false,
            Rundowns: true,
            Scripts: false,
            Storyboards: false,
            Video: false },
         NOMContentDates:
          { All: true,
            CustomDateRange: false,
            FortyEightHours: false,
            ItemDateFrom: '2018-10-02T00:00:01.000Z',
            ItemDateTo: '2018-10-02T23:59:00.000Z',
            Future: false,
            OneHour: false,
            OneWeek: false,
            TwentyFourHours: false,
            TwoHours: false },
         NOMLocations:
          [ { BasePath: location,
              SearchArchives: false,
              SearchTrash: false,
              SearchWIP: true } ] },
      json: true };

      // Return new promise
      return new Promise(function(resolve, reject) {
       // Do async job
          request.post(options, function(err, resp, body) {
              if (err) {
                  reject(err);
              } else {
                  var rundowns = [];
                  if (body['SearchResults'] === undefined || body['SearchResults'] === null || body['SearchResults'].length === 0) {
                    resolve(rundowns);
                  } else {
                    for (var i = 0; i < body['SearchResults'].length; i++) {
                      var z = body['SearchResults'][i];
                      if (z.ObjectProperties[10].FieldValue) {
                        var runObj = {
                          database: z.ListData.ENPSDatabase,
                          path: z.ListData.Path,
                          guid: z.ListData.Guid,
                          returnText: false
                        }
                        rundowns.push(runObj);
                      }
                    }
                  // logger.info('enps.js SEARCH : ', rundowns);
                  }
                resolve(rundowns);
                //[ { database: 'WRNN-ENPS1',
                    // path: 'P_HVFIOS\\W',
                    // guid: '1CED9FC7-7B3B-40D7-AAEAEF408375BCCB',
                    // returnText: false } ],
            }
          });
        });
  },
  listRundowns : function(serviceAddress, nomTokenId, recs){
    var options = { method: 'POST',
      url: serviceAddress + '/api/Lists',
      headers:
       { 'cache-control': 'no-cache',
         'Content-Type': 'application/json; charset=utf-8',
         'X-ENPS-TOKEN': nomTokenId },
      body: JSON.stringify(recs)
      //'{\r\n  "Database": "WRNN-ENPS1",\r\n  "ENPSListParameters": [{\r\n    "Path": "P_NJFIOS\\\\W",\r\n    "Guid": "",\r\n    "Type": 2,\r\n    "StartTime": "1800-03-01T05:00:00.000Z",\r\n    "EndTime": "1800-03-01T05:00:00.000Z",\r\n    "Priority": null,\r\n    "UnreadBy": ""\r\n  }]\r\n}'
    };
    return new Promise(function(resolve, reject){
      request.post(options, function (err, response, body) {
        if (err) {
            reject(err);
        } else {
            // logger.info('enps.js : ', body);
            var rundowns = [];
            var ro = JSON.parse(body);
            if (ro['Records'] === undefined || ro['Records'] === null || ro['Records'].length === 0) {
              resolve(rundowns);
            } else {
              for (var i = 0; i < ro['Records'].length; i++) {
                var z = ro['Records'][i];
                if (z.ObjectProperties[3].FieldValue) {
                  var runObj = {
                    guid: z.ListData.Guid,
                    title: z.ListData.Title
                  }
                  rundowns.push(runObj);
                }
              }
            }
          resolve(rundowns);
        }
      });
    });

  },
  getROContent : function(serviceAddress, nomTokenId, recs){
    var options = { method: 'GET',
      url: serviceAddress + '/api/RundownContent',
      qs: recs,
      headers:
       { 'cache-control': 'no-cache',
         'Content-Type': 'application/json; charset=utf-8',
         'X-ENPS-TOKEN': nomTokenId }
       };
      // Return new promise
      return new Promise(function(resolve, reject) {
       // Do async job
          request.get(options, function(err, resp, body) {
              if (err) {
                  reject(err);
              } else {
                resolve(JSON.parse(body));
            }
          });
        });
      },
      logout : function(serviceAddress, nomTokenId){
        var options = { method: 'GET',
          url: serviceAddress + '/api/Logout',
          headers:
           { 'cache-control': 'no-cache',
             'X-ENPS-TOKEN': nomTokenId }
           };
         // Return new promise
         return new Promise(function(resolve, reject) {
          // Do async job
             request.get(options, function(err, resp, body) {
                 if (err) {
                     reject(err);
                 } else {
                   resolve(JSON.parse(body));
               }
             });
           });
      },
      binarySearch : function(x, len, element){
        var low = 0;
        var high = len;

        while(low+1 < high){
            var test = Math.floor((low+high)/2);
           // console.log("Test : " + test);
            if(x[test] > element){
                high = test;
            }else{
                low = test;
            }
        }
        if(x[low].FieldName == element || x[low].FieldValue == element){
            return low;
        }else{
            return false;
        }

    }
}


module.exports = enps;
