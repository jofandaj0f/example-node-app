function findMOS(zone){
    $('#listData').each(function() {
      $('.panel-body').remove();
    });
    $('#header').append('<h4 id="blah">Logging In...</h4>');
    $('#loader').append('<div id="loading-spinner"><div class="spin-icon"></div></div>');
    $.ajax({
      url: '/api/v1/enps/logon',
      type: 'GET',
      datatype: 'json',
      contentType: 'application/json'
    }).done(function(data) {
      $('#blah').remove();
      $('#header').append('<h4 id="blah">Searching...</h4>');
      $.ajax({
        url:'/api/v1/enps/search',
        type: 'POST',
        datatype: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
          "sessionID" : data.SessionID,
          "zone" : zone
        })
      }).done(function(data1){
        console.log("Searches: ", data1);
        $('#blah').remove();
        $('#header').append('<h4 id="blah">Finding MOS IDs...</h4>');
        $.ajax({
          url:'/api/v1/enps/getMultiplePlanningContent',
          type: 'POST',
          datatype: 'json',
          contentType: 'application/json',
          data: JSON.stringify({
            "sessionID" : data.SessionID,
            "rundowns" : data1
          })
        }).done(function(rundownContent){
          console.log("Rundowns: ", rundownContent);
          //FOR LOOP GOES THROUGH EACH RUNDOWN
          // $('#page-loader').remove();
          for (var i = 0; i < rundownContent.length; i++) {
            var name = rundownContent[i].ListData.Title;
            // FOR LOOP GOES THROUGH EACH COLLECTION SCRIPTS
            $('#listData').append('<div class="panel-body"><h3>' + name + '</h3></div>');
            for (var k = 0; k < rundownContent[i].CollectionScripts.length; k++) {
              var breakdown = rundownContent[i].CollectionScripts[k].RecordPointer.ObjectProperties; //Pulls up the ObjectProperties Array
              // FOR LOOP GOES THROUGH ALL OBJECT PROPERTIES.
              var newness = {};
              for (var j = 0; j < breakdown.length; j++){// Creates Key and Values without FieldName and FieldValue of MOSAbstracts and Title.
                var stored1 = breakdown[j].FieldName;
                var stored2 = breakdown[j].FieldValue;
                newness[stored1] = stored2;
              }
              if(newness["MOSAbstracts"] !== undefined && newness["MOSAbstracts"].length < 12){
                $('#listData').append('<div class="panel-body"><h4>' + newness.MOSAbstracts + '</h4>:' + newness.Title + '</div>');
              }
            }
          }
        });
      });
    });
  }
//         // LOAD 3

//         getMultiplePlanningContent(loginID, rundowns).done(function(data) {
//           //FOR LOOP GOES THROUGH EACH RUNDOWN
//           // $('#page-loader').remove();
//           for (var i = 0; i < data.length; i++) {
//             var name = data[i].ListData.Title;
//             // FOR LOOP GOES THROUGH EACH COLLECTION SCRIPTS
//             $('#listData').append('<div class="panel-body"><h3>' + name + '</h3></div>');
//             for (var k = 0; k < data[i].CollectionScripts.length; k++) {
//               var breakdown = data[i].CollectionScripts[k].RecordPointer.ObjectProperties; //Pulls up the ObjectProperties Array
//               // FOR LOOP GOES THROUGH ALL OBJECT PROPERTIES.
//               var newness = {};
//               for (var j = 0; j < breakdown.length; j++){// Creates Key and Values without FieldName and FieldValue of MOSAbstracts and Title.
//                 var stored1 = breakdown[j].FieldName;
//                 var stored2 = breakdown[j].FieldValue;
//                 newness[stored1] = stored2;
//               }
//               if(newness["MOSAbstracts"] !== undefined && newness["MOSAbstracts"].length < 12){
//                 $('#listData').append('<div class="panel-body"><h4>' + newness.MOSAbstracts + '</h4>:' + newness.Title + '</div>');
//               }
//             }
//           }
//           $('#blah').remove();
//           $('#loading-spinner').remove();
//         });
//       });
//     });
//   });
// }
