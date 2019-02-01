
'use strict';

const config = require('../config');
const AuthService = require('./auth');
const authService = new AuthService(config.auth.secret);
//const Connection = require('./db');
//const conn = new Connection();

module.exports = {
	logger: require('./logger'),
	expresslogger: require('./expresslogger'),
	users: require('./users'),
	enpsdb: require('./watchfile'),
	// pooldb: require('./pooldb'),
	AuthService: authService,
	enps: require('./enps'),
	watchfile: require('./watchfile'),
	zapier: require('./zapier'),
	mongo: require('./mongoclient')
}
