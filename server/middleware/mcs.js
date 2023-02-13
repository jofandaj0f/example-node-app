'use strict';
const axios = require('axios');
const logger = require('./logger');

function MCS(){

}

MCS.prototype.senderAction = async(req,flowAction) => {
    return new Promise((resolve,reject) => {
        let mcsRes = {};
        axios.post(`http://${req.body.mcsIP}/mcs/multicast/senders`, { 
            "data": 
                [
                    {
                        "destinationIP": req.body.destinationIP,
                        "sourceIP": req.body.sourceIP,
                        "bandwidth": Number(req.body.bandwidth) / 100,
                        "bwType": req.body.bwType,
                        "inIntfID": req.body.inIntfID
                    }
                ],
                "flow-action": flowAction,
                "transactionID": "FromCVX",
                "trackingID": req.body.trackingID
        })
        .then(function(response){
            logger.info({
                level: 'info',
                message: `Response from CVX: \n Messages: ${response.data.status.messages} \n Success of action: ${response.data.status.success} \n Success of POST: ${response.data.success} \n`
            });
            
            if(response.data.status.messages.length > 0){
                let messages = [];
                response.data.status.messages.forEach(message => {
                    // console.log(message);
                    for (const key in mcsErrorCodes){
                        console.log(key + ":" + message);
                        if(key === message) {
                            console.log("HA");
                            messages.push(mcsErrorCodes[key]);
                            
                        }
                    }
                });
                mcsRes = {
                    "messages" : messages,
                    "ActionStatus" : response.data.status.success,
                    "PostStatus" : response.data.success,
                    "Action": response.data.status.senders.action
                };
            } else {
                mcsRes = {
                    "messages" : response.data.status.messages,
                    "ActionStatus" : response.data.status.success,
                    "PostStatus" : response.data.success,
                    "Action": response.data.status.senders.action
                };
            }
        })
        .catch(function(err){
            console.log(err);
            mcsRes = {"Error":err};
        })
        .finally(function(){
            resolve(mcsRes);
        });
       }); 
    };

module.exports = MCS;