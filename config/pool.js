'use strict'

module.exports = {
    connectionLimit: 10, //important, limits the connections to Vision.
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'user', //groot
    password: process.env.DB_PASSWORD || 'pass',
    database: process.env.DB_NAME || 'mydbpooled',
    port: process.env.DB_PORT || 3306,
    debug: false,
    waitForConnections: true
}
