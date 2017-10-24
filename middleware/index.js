
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
	convivaClient: require('./convivaclient'),
	radioClient: require('./radioclient'),
	//Connection: conn,
	poolVision: require('./pooldb'),
	AuthService: authService,
	uplynkClient: require('./uplynkClient'),
	tvlistings: require('./tvlistings'),
	pccAPI: require('./pccAPI')
}
