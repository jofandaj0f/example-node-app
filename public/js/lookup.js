function download_csv(data, name) {
  // data = [
  //   ['Foo', 'programmer'],
  //   ['Bar', 'bus driver'],
  //   ['Moo', 'Reindeer Hunter']
  // ];
  var csv = "Story Slug,Event Time,Location,Type,Status,Reporter,Crew,Writer,Path,GUID\n";
  $.each(JSON.parse(data), function( key, value ) {
      if(value.slug == "ALL ZONES" || value.slug == "LONG ISLAND" ||
          value.slug == "PHOTOGS LI" || value.slug == "NEW JERSEY" ||
        value.slug == "PHOTOGS NJ" || value.slug == "HUDSON VALLEY" ||
      value.slug == "PHOTOGS HV" || value.slug == "FUTURES" || value.slug == "AJ TRUCK OP 930") {
        console.log("Skipping header...");
      }
      else {
        if (value.slug !== undefined){

          var slugger = value.slug.replace(/,/g, '')

          csv += slugger + ",";
          // console.log(value.slug);
        }
        else if (value.slug === undefined){
          csv += ",";
        }
        csv += value.eventTime + ",";
        csv += value.location + ",";
        csv += value.type + ",";
        csv += value.status + ",";
        if (value.reporter[0] !== undefined){
          var lengthOff = value.reporter[0].length;
          csv += value.reporter[0].substring(16,lengthOff) + ",";
        }
        else if (value.reporter[0] === undefined){
          csv += ",";
        }
        if (value.crew[0] !== undefined){
          var lengthOf = value.crew[0].length;
          csv += value.crew[0].substring(5,lengthOf) + ",";
        }
        else if (value.crew[0] === undefined){
          csv += ",";
        }
        csv += value.writer + ",";
        csv += value.path + ",";
        csv += value.guid + ",";
        csv += "\n"
      }
  });
  console.log("Done Parsing Grid");
  console.log("Downloading CSV file now...");
  var hiddenElement = document.createElement("a");
  hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
  hiddenElement.target = "_blank";
  hiddenElement.download = name;
  hiddenElement.click();
  $(".lds-ellipsis").remove();
}

$(document).on('click', '#submit-grid', function() {
  $('.col-md-3').append('<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>');
  var date = $('#theDate').val().toString();
  if (date.length !== 8) {
    alert('Select Date!');
  }
  $.ajax({
    url: '/api/v1/enps/writeGridtoFile',
    type: 'POST',
    datatype: 'json',
    contentType: 'application/json',
    data: JSON.stringify({
    	"date" : date
    })
  }).done(function(data) {
    var fileName = "Fios1News_Planning_Grid_20" + $('#theDate').val() + ".csv";
    download_csv(data, fileName);
  });
});

$(document).on('click', '#submit-ro', function() {
  var date = $('#theDate').val().toString();
  if (date.length !== 8) {
    alert('Select Date!');
  }
  $.ajax({
    url: '/api/v1/enps/writeROtoFile',
    type: 'POST',
    datatype: 'json',
    contentType: 'application/json',
    data: JSON.stringify({
    	"date" : date
    })
  }).done(function(data) {
    var fileName = "Fios1News_Rundown_20" + $('#theDate').val() + ".csv";
    download_csv(data, fileName);
  });
});
