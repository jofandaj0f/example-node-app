'use strict';

const express = require('express');
const router = express.Router();
const AuthService = require('../middleware').AuthService;
const bodyParser = require('body-parser');
const config = require('../config');
const middleware = require('../middleware');

router.use(bodyParser.urlencoded({
	extended: true
}));

router.get('/', function(req, res) {
	return res.render('login');
});

router.post('/', function(req, res) {
	const password = req.body.password;

	if (password !== config.auth.passphrase) {
		let backURL=req.header.referer|| '/';
  	// do your thang
  	return res.redirect(backURL);
		//return res.redirect('login');
	};
	res.redirect('/?token=' + AuthService.generateToken());
});

module.exports = router;
