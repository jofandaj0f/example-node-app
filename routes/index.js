'use strict';

const express = require('express');
const router = express.Router();
const AuthService = require('../middleware').AuthService;
const middleware = require('../middleware');
require('dotenv').load();

const isAuthenticated = function(req, res, next) {
	const token = req.query.token;
	if (!token || !AuthService.isValid(token)) {
		return res.redirect('/login');
	}
	next();
}

router.get('/', function(req, res) {
	return res.render('index');
});


module.exports = router;
