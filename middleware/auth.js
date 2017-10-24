'use strict';

const moment = require('moment');
const crypto = require('crypto');
const logger = require('./logger');

function AuthService(secret) {
	this.secret = secret;
};

AuthService.prototype.generateToken = function() {

	logger.debug(crypto);
	const timestamp = moment().format();

	const cipher = crypto.createCipher('aes192', this.secret);

	let token = cipher.update(timestamp, 'utf8', 'hex');
	token += cipher.final('hex');

	return token;
};

AuthService.prototype.isValid = function(token) {
	const decipher = crypto.createDecipher('aes192', this.secret);

	let decryptedToken = decipher.update(token, 'hex', 'utf8');
	decryptedToken += decipher.final('utf8');

	const timestamp = moment(decryptedToken);
	return moment().diff(timestamp, 'minutes') < 31;
};

module.exports = AuthService;