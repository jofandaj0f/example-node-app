'use strict';

module.exports = {
	auth: require('./auth'),
	secret: require('./secret'),
	server: require('./server'),
	//Commented out db config so that Pool config is in use. 
	//db_config: require('./db'),
	pool_config: require('./pool')
}
