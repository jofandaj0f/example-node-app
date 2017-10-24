'use strict';

module.exports = {
	host: process.env.DB_HOST || '127.0.0.1',
	user: process.env.DB_USER || 'user',
	password: process.env.DB_PASSWORD || 'password',
	database: process.env.DB_NAME || 'mydb',
	port: process.env.DB_PORT || 3306,
	debug: process.env.DB_DEBUG || false
}
