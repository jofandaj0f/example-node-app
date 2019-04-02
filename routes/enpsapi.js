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
	// var sendMe = 'Grid downloaded for ' + information.date + ' : ' + dateTime;
	// res.send(sendMe);
});

router.get('/enps/logon', function(req, res) {
  if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
  }
  var url = process.env.URL.toString();
  var apiName = process.env.API_NAME.toString();
  var passEnps = process.env.PASS_ENPS.toString();
  var enpsName = process.env.ENPS_NAME.toString();
  var apiKey = process.env.API_KEY.toString();
  var id = middleware.enps.logon(url, apiName, passEnps, enpsName, apiKey).then(content => {
    middleware.logger.info("Logon content: ", content);
    res.send(content);
  });
});

router.post('/enps/search', function(req, res) {
  var info = req.body;
  middleware.logger.info('enpsapi.js search: ', info);
  if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
  }
  var url = process.env.URL.toString();
  var db = process.env.DATABASE.toString();
  var id = middleware.enps.search(url, info.sessionID, db, info.zone).then(content => {
    // middleware.logger.info("Search content: ", content);
    res.send(content);
  });
});

router.post('/enps/getMultiplePlanningContent', function(req, res){
  var info = req.body;
  if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
  }
  var url = process.env.URL.toString();
  middleware.logger.info('enpsapi.js getContent: ', info);
  var id = middleware.enps.getMultiplePlanningContent(url, info.sessionID, info.rundowns).then(content => {
    // middleware.logger.info("getMultiplePlanningContent content : ", content);
    res.send(content);
  });

});


module.exports = router;
