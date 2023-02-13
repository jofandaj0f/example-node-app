
'use strict';

const config = require('../config');
const AuthService = require('./auth');
const authService = new AuthService(config.auth.secret);
//const Connection = require('./db');
//const conn = new Connection();
const mcsErrorCodes = require('./mcserrorcodes');
const mcs = require('./mcs');
const MCS = new mcs();

module.exports = {
	logger: require('./logger'),
	errorlogger: require('./errorlogger'),
	users: require('./users'),
	//Connection: conn,
	MCS: MCS,
	poolVision: require('./pooldb'),
	AuthService: authService,
	mcsErrorCodes: mcsErrorCodes
	
}
