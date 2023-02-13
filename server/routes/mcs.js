'use strict';
let reqBody = {
	"data": [
		{
			"destinationIP": "239.101.194.100",
			"sourceIP": "10.239.129.30",
			"bandwidth": 1,
			"bwType": "m",
			"inIntfID": "94:8e:d3:1b:7e:d3-Ethernet4"
		}
	],
	"flow-action": "delSenders",
	"transactionID": "test",
	"trackingID": 892244
}
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { mcsErrorCodes } = require('../middleware');
const logger = require('../middleware').logger;
const logError = require('../middleware').errorlogger;
const MCS = require('../middleware').MCS;

let goodRes = {
    "messages": [],
    "status": {
        "success": true,
        "trackingID": 892244,
        "receivers": {},
        "transactionID": "test",
        "messages": [],
        "senders": {
            "action": "del",
            "validSenders": [
                {
                    "bandwidth": 1000,
                    "destinationIP": "239.101.194.100",
                    "messages": [],
                    "sourceIP": "10.239.129.30",
                    "inIntfID": "94:8e:d3:1b:7e:d3-Ethernet4",
                    "bwType": "k"
                }
            ],
            "failedSenders": []
        }
    },
    "success": true
}

router.post('/delete-sender', function(req, res) {
	MCS.senderAction(req,"delSenders").then(result => {
		res.send(result);
	});
});

router.post('/modify-sender', function(req, res) {
	MCS.senderAction(req,"modBw").then(result => {
		res.send(result);
	});
});

router.post('/add-sender', function(req, res) {
	MCS.senderAction(req,"addSenders").then(result => {
		res.send(result);
	});
});

router.get('/get-senders', function(req, res) {
	logger.info({
        level: 'info',
        message: `Grabbing Senders from ${req.query.ip}`
    });
	
	let senders = [];
	axios.get(`http://${req.query.ip}/mcs/senders`)
	.then(function(response){
		logger.info({
			level: 'info',
			message: `${response.data.senders.length} Senders Total`
		});
		let sortedArray = response.data.senders.sort((a,b) => parseInt(a.trackingID) - parseInt(b.trackingID));
		sortedArray.forEach(e => {
			console.log(e.trackingID);
			senders.push({
				"bandwidth": e.bandwidth,
				"destinationIP": e.destinationIP,
				"messages": e.messages,
				"senderId": e.senderId,
				"senderPort": e.senderPort,
				"sourceIP": e.sourceIP,
				"success": e.success,
				"trackingID": e.trackingID
			})
		});
	})
	.catch(function(err){
		console.log(err);
		senders.push(err.cause);
	})
	.finally(function(){
		return res.send(senders);
	});
	
	// return res.send([
	// 		{
	// 			"bandwidth": 100000,
	// 			"destinationIP": "224.1.0.10",
	// 			"messages": [],
	// 			"senderId": "001c.738d.1569",
	// 			"senderPort": "Ethernet5",
	// 			"sourceIP": "10.1.1.100",
	// 			"success": true,
	// 			"trackingID": 69
	// 		},
	// 		{
	// 			"bandwidth": 100000,
	// 			"destinationIP": "224.1.0.10",
	// 			"messages": [],
	// 			"senderId": "001c.6532.1569",
	// 			"senderPort": "Ethernet1",
	// 			"sourceIP": "10.1.1.100",
	// 			"success": true,
	// 			"trackingID": 70
	// 		}
	// 	]);
});

module.exports = router;