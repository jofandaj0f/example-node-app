'use strict'

var request = require("request");
var logger = require("./logger");
var assert = require("assert");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

var writeCSV = {
  writeENPStoFile: function(body, filename, directory){
    var csvWriter = createCsvWriter({
      path: directory + filename + '.csv',
      header: [
        {id: 'slug', title: 'Story Slug'},
        {id: 'segment', title: 'Segment'},
        {id: 'eventTime', title: 'Event Time'},
        {id: 'location', title: 'Location'},
        {id: 'type', title: 'Type'},
        {id: 'reporter', title: 'Reporter Assigned'},
        {id: 'crew', title: 'Crew'},
        {id: 'guid', title: 'GUID'},
        {id: 'webeditor', title: 'Web Editor Request'},
        {id: 'writer', title: 'Writer'},
        {id: 'path', title: 'Path'}
      ]
    });
    var myArray = new Array();
    for (var i = 0; i < body.CollectionScripts.length; i++) {
      var breakdown = body.CollectionScripts[i].RecordPointer.ObjectProperties;
      var obj = {};
      for (var j = 0; j < breakdown.length; j++) {
        var sto1 = breakdown[j].FieldName;
        var sto2 = breakdown[j].FieldValue;
        obj[sto1] = sto2;
      }
      myArray.push(obj);
    };
    // logger.info(myArray);
    var data = new Array();
    for (var k = 0; k < myArray.length; k++){
      // logger.info(myArray[k].Title);
      var pushItrealGood = {
        slug: myArray[k].Title,
        // segment: myArray[k].,
        // eventTime: myArray[k].,
        location: myArray[k].LOCATION,
        // type: myArray[k],
        reporter: myArray[k].StaffIDReporter,
        crew: myArray[k].Crew,
        webeditor: myArray[k].WebEditorRequest,
        writer: myArray[k].Writer,
        path: myArray[k].Path,
        guid: myArray[k].GUID
      }
      data.push(pushItrealGood);
    };
    logger.info(data);
    csvWriter
      .writeRecords(data)
      .then(()=> logger.info('The CSV file was written successfully'));
    return myArray;
  }
};

module.exports = writeCSV;
