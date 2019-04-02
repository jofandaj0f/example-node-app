function download_csv(data, name) {
  // data = [
  //   ['Foo', 'programmer'],
  //   ['Bar', 'bus driver'],
  //   ['Moo', 'Reindeer Hunter']
  // ];
  var csv = 'Story Slug,Location,Reporter,Crew,WebEditorRequest,Writer,Path,GUID\n';
  $.each( JSON.parse(data), function( key, value ) {
      if(value.slug === 'ALL ZONES' || value.slug === 'LONG ISLAND' ||
          value.slug === 'PHOTOGS LI' || value.slug === 'NEW JERSEY' ||
        value.slug === 'PHOTOGS NJ' || value.slug === 'HUDSON VALLEY' ||
      value.slug === 'PHOTOGS HV' || value.slug === 'FUTURES'){
        continue;
      }
      if (value.slug !== undefined){
        csv += value.slug + ',';
      }
      else if (value.slug === undefined){
        csv += ',';
      }
      csv += value.location + ',';
      if (value.reporter[0] !== undefined){
        csv += value.reporter[0] + ',';
      }
      else if (value.reporter[0] === undefined){
        csv += ',';
      }
      if (value.crew[0] !== undefined){
        csv += value.crew[0] + ',';
      }
      else if (value.crew[0] === undefined){
        csv += ',';
      }
      csv += value.webeditor + ',';
      csv += value.writer + ',';
      csv += value.path + ',';
      csv += value.guid + ',';
      csv += "\n"

  });

  // console.log(csv);
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  hiddenElement.target = '_blank';
  hiddenElement.download = name;
  hiddenElement.click();
}

$(document).on('click', '#submit-ro, #submit-grid', function() {
  var date = $('#theDate').val().toString();
  if (date.length !== 8) {
    alert('Select Date!');
  }
  console.log(date);
  console.log(date.length);
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
