'use strict';

const express = require('express');
const router = express.Router();
const AuthService = require('../middleware').AuthService;
const middleware = require('../middleware');

const isAuthenticated = function(req, res, next) {
	const token = req.query.token;
	if (!token || !AuthService.isValid(token)) {
		return res.redirect('/login');
	}
	next();
}
router.post('/enps/writeGridtoFile', function(req, res){
	if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
  }
	var information = req.body;
	middleware.logger.info(information);
	var dateTime = new Date();
  middleware.grabRundowns.runGrid('DESK', information.date, 'download')
		.then(function(csvData){
			res.setHeader('Content-disposition', 'attachment; filename=data.csv');
	    res.set('Content-Type', 'text/csv');
	    res.status(200).send(csvData);
		});
});

router.post('/enps/writeROtoFile', function(req, res){
	if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
  }
	var information = req.body; //contains date enpsFolder and
	middleware.logger.info(information);
	var dateTime = new Date();
	middleware.enps.logon(process.env.ENPS_HOST, process.env.ENPS_USER, process.env.ENPS_PASS, process.env.ENPS_DOMAIN, process.env.ENPS_DEVKEY)
		.then(function(dataLogin){
			var optionsRO = {
				database: process.env.ENPS_DB,
				path: 'P_' + information['enpsFolder'] + '\\W',
				guid: information['guid'], //"BA7AF919-D626-4543-ABE9D664277B146A",
				hitHighlightTerm: '',
				returnText: 'false'
			};
			middleware.enps.getROContent(process.env.ENPS_HOST, dataLogin['SessionID'], optionsRO)
				.then(function(dataContent){
					if (dataContent.length > 1 || dataContent.length < 1) {
						var err = optionsRO.guid + ' === ' + dataContent;
						throw new Error(err);
					}
					var myArray = new Array();
					var rundownName = dataContent["ListData"]["ModTime"].substring(0, 10) + ' ' + dataContent["ListData"]["Title"];
						for (var i = 0; i < dataContent.CollectionScripts.length; i++) {
							var breakdown = dataContent.CollectionScripts[i].RecordPointer.ObjectProperties;
							var obj = {};
							for (var j = 0; j < breakdown.length; j++) {
								var sto1 = breakdown[j].FieldName;
								var sto2 = breakdown[j].FieldValue;
								obj[sto1] = sto2;
							}
							myArray.push(obj);
						};
						middleware.logger.info(rundownName + ' is ' + myArray.length + ' Pages long.');
						res.status(200).send(myArray);
				}).catch(function(err){
					middleware.logger.error(err);
					res.status(500).send(err);;
		}).catch(function(err){
			middleware.logger.error(err);
			res.status(500).send(err);
		});
});
});


router.post('/enps/listRundowns', function(req, res) {
  var info = req.body;
  middleware.logger.info('enpsapi.js search: ', info, process.env.ENPS_HOST);
  if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
  }
	middleware.enps.logon(process.env.ENPS_HOST, process.env.ENPS_USER, process.env.ENPS_PASS, process.env.ENPS_DOMAIN, process.env.ENPS_DEVKEY)
		.then(function(dataLogin){
			var preDate = "20" + info.date;
			middleware.logger.info(preDate);
			var session = dataLogin.SessionID;
			var MyDate = new Date(preDate);
			var MyDateString;
			MyDate.setDate(MyDate.getDate() + 2);
			MyDateString = MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '-' + ('0' + MyDate.getDate()).slice(-2);
			middleware.logger.info(MyDateString);
			middleware.enps.listRundowns(process.env.ENPS_HOST, session, {
				"Database": process.env.ENPS_DB,
				"ENPSListParameters": [{
					"Path": "P_" + info.enpsFolder + "\\W",
					"Guid": "",
					"Type": 2,
					"StartTime": preDate + "T05:00:00.000Z",
					"EndTime": MyDateString + "T05:00:00.000Z",
					"Priority": null,
					"UnreadBy": "" }]
			}).then(function(dataList){
					// middleware.logger.info(dataList);
					res.status(200).send(dataList);
				}).catch(function(err){
					middleware.logger.error(err);
					res.status(500).send(err);
				});
		}).catch(function(err){
			middleware.logger.error(err);
			res.status(500).send(err);
		});
});

module.exports = router;
