export function MCS(ip, bandwidth, bwType, sourceIP, destinationIP, inIntfID, trackingID){
    this.ip = ip;
    this.bandwidth = bandwidth;
    this.sourceIP = sourceIP;
    this.destinationIP = destinationIP;
    this.inIntfID = inIntfID;
    this.bwType = bwType;
    this.trackingID = trackingID;
}

MCS.formatHtml = function(a,id){
  console.log(a);
  $(id).empty();
  a.forEach(e => {
    $(id).append(`<li class="list-group-item"><ul class="list-group list-group-flush"><li class="list-group-item list-group-item-dark"><h4>Tracking ID</h4><button type="button" class="btn btn-outline-warning" value="${e.trackingID}" onclick="writeValToAction()"><p>${e.trackingID}</p></button></li><li class="list-group-item list-group-item-light"><h4>Bandwidth</h4><button type="button" class="btn btn-outline-warning"><p>${e.bandwidth}</p></button></li><li class="list-group-item list-group-item-light"><h4>Multicast Destination IP</h4><button type="button" class="btn btn-outline-warning"><p>${e.destinationIP}</p></button></li><li class="list-group-item list-group-item-light"><h4>Incoming Interface ID</h4><button type="button" class="btn btn-outline-warning"><p>${e.senderId}-${e.senderPort}</p></button></li></ul></li>`); 
    // $(id).append(`<li class="list-group-item"><ul class="list-group list-group-flush"><li class="list-group-item list-group-item-dark"><h4>Tracking ID</h4><p>${e.trackingID}</p></li><li class="list-group-item list-group-item-light"><h4>Bandwidth</h4><p>${e.bandwidth}</p></li><li class="list-group-item list-group-item-light"><h4>Multicast Destination IP</h4><p>${e.destinationIP}</p></li><li class="list-group-item list-group-item-light"><h4>Incoming Interface ID</h4><p>${e.senderId}-${e.senderPort}</p></li></ul></li>`); 
    //$(id).append(`<li class="list-group-item"><ul class="list-group list-group-flush"><li class="list-group-item"><p>Tracking ID: </p>${e.trackingID}</li><li class="list-group-item"><p>Bandwidth: </p>${e.bandwidth}</li><li class="list-group-item"><p>Multicast Destination IP: </p>${e.destinationIP}</li><li class="list-group-item"><p>Incoming Interface ID: </p>${e.senderId}-${e.senderPort}</li></ul></li>`);     
    //$(id).append(`<li class="list-group-item"><ul class="list-group list-group-flush"><li class="list-group-item">Tracking ID: ${e.trackingID}</li><li class="list-group-item">Bandwidth: ${e.bandwidth}</li><li class="list-group-item">Multicast Destination IP: ${e.destinationIP}</li><li class="list-group-item">Incoming Interface ID: ${e.senderId}-${e.senderPort}</li></ul></li>`);    
  });
}

MCS.getSenders = function(ip,id,array){
    console.log("Getting Senders from", ip);
    $(id).append('<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>');
    $.ajax({
        "url": `/mcs/get-senders?ip=${ip}`,
        "method": "GET",
        "timeout": 0,
        "error": function(err){
          console.log(err);
          console.log('Request Status: ' + err.status + ' Status Text: ' + err.statusText + ' ' + err.responseText);
          return err;
        },
        "success" : function(res) {
          console.log('Success', res);
          array = res;
          return res;
        }
      });
}

MCS.modBw = function(){
    var settings = {
        "url": `${this.ip}/mcs/multicast/senders`,
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "data": [
            {
              "destinationIP": this.destinationIP,
              "sourceIP": this.sourceIP,
              "bandwidth": this.bandwidth,
              "bwType": this.bwType,
              "inIntfID": this.inIntfID
            }
          ],
          "flow-action": "modBw",
          "transactionID": "GS#1",
          "trackingID": this.trackingID
        }),
      };
      
      $.ajax(settings).done(function (response) {
        console.log(response);
        return response;
      });
}

MCS.delSenders = function(){
    var settings = {
        "url": `${this.ip}/mcs/multicast/senders`,
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "data": [
            {
              "destinationIP": this.destinationIP,
              "sourceIP": this.sourceIP,
              "bandwidth": this.bandwidth,
              "bwType": this.bwType,
              "inIntfID": this.inIntfID
            }
          ],
          "flow-action": "delSenders",
          "transactionID": "GS#1",
          "trackingID": this.trackingID
        }),
      };
      
      $.ajax(settings).done(function (response) {
        console.log(response);
        return response;
      });
}

MCS.addSenders = function(){
    var settings = {
        "url": `${this.ip}/mcs/multicast/senders`,
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "data": [
            {
              "destinationIP": this.destinationIP,
              "sourceIP": this.sourceIP,
              "bandwidth": this.bandwidth,
              "bwType": this.bwType,
              "inIntfID": this.inIntfID
            }
          ],
          "flow-action": "delSenders",
          "transactionID": "GS#1",
          "trackingID": this.trackingID
        }),
      };
      
      $.ajax(settings).done(function (response) {
        console.log(response);
        return response;
      });
}

MCS.SearchSenders = function(a){

}

