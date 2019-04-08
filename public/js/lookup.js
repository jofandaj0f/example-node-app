function download_csv(data, name, type) {
  // console.log(data);
  var csv = "";
  var zone = "";
  if (type == 'grid') {
    csv += "Story Slug,Event Time,Location,Zone,Type,Status,Reporter,Crew,V R X,Path,GUID\n";
    $.each(data, function(key, value) {

      if ( value.slug == "PHOTOGS LI" || value.slug == "PHOTOGS NJ" ||
       value.slug == "PHOTOGS HV"  || value.slug == "AJ TRUCK OP 930" || value.slug == "FUTURES") {
        console.log("Skipping Header...");
      }
      if (value.slug == "ALL ZONES" || value.slug == "LONG ISLAND" ||
       value.slug == "NEW JERSEY" || value.slug == "HUDSON VALLEY" ) {
        zone = value.slug;
      } if (value.reporter[0] === undefined && value.crew[0] === undefined) {
        console.log("No assigned field staff...");
      } else {
        if (value.slug !== undefined) {
          var vrx = "";
          var slugger = value.slug.replace(/,/g, '');
          csv += slugger + ",";
          // console.log(value.slug);
        } else if (value.slug === undefined) {
          csv += ",";
        }
        csv += value.eventTime + ",";
        csv += value.location + ",";
        csv += zone + ",";
        csv += value.type + ",";
        csv += value.status + ",";
        if (value.reporter[0] !== undefined) {
          var lengthOff = value.reporter[0].length;
          csv += value.reporter[0].substring(17, lengthOff) + ",";
          vrx += "R";
        } else if (value.reporter[0] === undefined) {
          csv += ",";
        }
        if (value.crew[0] !== undefined) {
          var lengthOf = value.crew[0].length;
          csv += value.crew[0].substring(6, lengthOf) + ",";
          vrx += "V";
        } else if (value.crew[0] === undefined) {
          csv += ",";
        }
        csv += vrx + ",";
        csv += value.path + ",";
        csv += value.guid + ",";
        csv += "\n"
      }
    });
  }
  if (type == 'RO') {
    csv += "Page,Story Slug,Segment,Xpression,MOS ID,Front,Back,LastModBy,Estimated Duration,Float,Path,GUID\n";
    $.each(data, function(key, value) {
      csv += value.PageNum + ",";
      if (value.Title !== undefined) {
        var dash = value.Title.indexOf('-') + 1;
        var slugLen = value.Title.length;
        var slugger = value.Title.replace(/,/g, '');

        csv += slugger.substring(0, value.Title.indexOf('-')) + ",";
        csv += value.Title.substring(dash, slugLen) + ",";
        // console.log(value.slug);
      } else if (value.Title === undefined) {
        csv += ",";
        csv += ",";
      }
      console.log(value.WRNNXpressionMOS);
      if (value.WRNNXpressionMOS !== undefined){
        var len;
        var banners = "";
        for (var i = 0; value.WRNNXpressionMOS.length; i++){
          if (value.WRNNXpressionMOS[i] === undefined){
            break;
          }
          console.log(value.WRNNXpressionMOS[i], i, len);
          var bannerDel = value.WRNNXpressionMOS[i].indexOf(':') + 1;
          banners += value.WRNNXpressionMOS[i].substring(bannerDel, value.WRNNXpressionMOS[i].length).replace(/,/g, "") + " ";
        }
        csv += banners + ",";
      } else if (value.WRNNXpressionMOS === undefined){
        csv += ",";
      }
      if(value.WRNNCrispNew[0] !== undefined){
          csv += value.WRNNCrispNew[0] + ",";
      }
      else {
        csv += ",";
      }
      // if(value.MOSItemDuration !== undefined){
      //     csv += value.MOSItemDuration + ",";
      // }
      // else {
      //   csv += ",";
      // }
      csv += value.FrontTime + ",";
      csv += value.BackTime + ",";
      if(value.RowModBy !== undefined){
          csv += value.RowModBy + ",";
      }
      else {
        csv += ",";
      }
      if(value.Estimated !== undefined){
          csv += value.Estimated + ",";
      }
      else {
        csv += ",";
      }
      csv += value.Float + ",";
      csv += value.Path + ",";
      csv += value.GUID + ",";
      csv += "\n"

    });
  }

  console.log("Done Parsing Grid");
  console.log("Downloading CSV file now...");
  var hiddenElement = document.createElement("a");
  hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
  hiddenElement.target = "_blank";
  hiddenElement.download = name;
  hiddenElement.click();
  $(".lds-ellipsis").remove();
}

$(document).on('click', '#listRundowns', function() {
  console.log('Grabbing Rundowns');
  var date = $('#theDate').val().toString();
  var enpsFolder = $('#zones').val().toString();
  if (date.length !== 8) {
    alert('Select Date!');
  }
  else {
    $('#loader').append('<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>');
    $.ajax({
      url: '/api/v1/enps/listRundowns',
      type: 'POST',
      datatype: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        "date": date,
        "enpsFolder": enpsFolder
      })
    }).done(function(data) {
      // var fileName = "Fios1News_Planning_Grid_20" + $('#theDate').val() + ".csv";
      // download_csv(data, fileName, 'grid');
      $('#rundowns > option').remove();
      $.each(data, function(key, value) {
        var o = new Option(value["title"], value["guid"]);
        /// jquerify the DOM object 'o' so we can use the html method
        $(o).html(value["title"]);
        $('#rundowns').append(o);
        $('.selectpicker').selectpicker('refresh');
        // $('body > div > main > div:nth-child(7) > div:nth-child(2) > div > div > div > div > ul').append(o);
        // $('#rundowns').append('<option value=' + value["guid"] + '>' + value["title"] + '</option>');
      });
      $(".lds-ellipsis").remove();
    });
  }
});

$(document).on('click', '#submit-grid', function() {
  var date = $('#theDate').val().toString();
  if (date.length !== 8) {
    alert('Select Date!');
  }
  else {
    $('#loader').append('<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>');
    $.ajax({
      url: '/api/v1/enps/writeGridtoFile',
      type: 'POST',
      datatype: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        "date": date
      })
    }).done(function(data) {
      var fileName = "Fios1News_Planning_Grid_20" + $('#theDate').val() + ".csv";
      download_csv(data, fileName, 'grid');
    });
  }
});

$(document).on('click', '#download-ro', function() {
  var date = $('#theDate').val().toString();
  if (date.length !== 8) {
    alert('Select Date!');
  }
  else {
    $('#loader').append('<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>');
    $.ajax({
      url: '/api/v1/enps/writeROtoFile',
      type: 'POST',
      datatype: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        "guid": $('#rundowns').val(),
        "enpsFolder": $('#zones').val()
      })
    }).done(function(data) {
      console.log(data[0]);
      var fileName = "Fios1News_" + $('body > div > main > div:nth-child(7) > div:nth-child(2) > div > div > button').attr('title') + "_20" + $('#theDate').val() + ".csv";
      download_csv(data, fileName, 'RO');
    });
  }
});

$(document).ready(function() {
  $('select').selectpicker();
});
