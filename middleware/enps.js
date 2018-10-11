var request = require("request");
var logger = require('./logger');
var enps = {
  logon : function(serviceAddress, userName, password, domainName, devKey){
    //Logon
    var options = { method: 'GET',
      url: serviceAddress + '/api/Logon',
      qs:
       { staffUserId: userName,
         domainuserId: 'enpsapi',
         password: password,
         domainName: domainName,
         devKey: devKey,
         iClientType: '7' },
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

      console.log(body);
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
                resolve(rundowns);
                //[ { database: 'WRNN-ENPS1',
                    // path: 'P_HVFIOS\\W',
                    // guid: '1CED9FC7-7B3B-40D7-AAEAEF408375BCCB',
                    // returnText: false } ],
            }
          });
        });
  },
  getMultiplePlanningContent : function(serviceAddress, nomTokenId, recs){
    var options = { method: 'POST',
      url: serviceAddress + '/api/RundownContent',
      headers:
       { 'Content-Type': 'application/json',
         'X-ENPS-TOKEN': nomTokenId },
      body: recs,
      json: true };

      // Return new promise
      return new Promise(function(resolve, reject) {
       // Do async job
          request.post(options, function(err, resp, body) {
              if (err) {
                  reject(err);
              } else {
                resolve(body);
            }
          });
        });
      }
}


module.exports = enps;
