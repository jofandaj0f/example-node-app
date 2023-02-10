
'use strict';

const config = require('../config');
const AuthService = require('./auth');
const authService = new AuthService(config.auth.secret);
//const Connection = require('./db');
//const conn = new Connection();

module.exports = {
	logger: require('./logger'),
	errorlogger: require('./errorlogger'),
	users: require('./users'),
	//Connection: conn,
	poolVision: require('./pooldb'),
	AuthService: authService
}
