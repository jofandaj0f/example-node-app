/*jshint camelcase: false*/
'use strict';

exports.config = {
    app_name: process.env.NEW_RELIC || ['my_node_app'],
    license_key: process.env.API_KEY_NR,
    logging: {
        level: 'info'
    },
    browser_monitoring: {
        enable: true
    },
    error_collector: {
        enabled: true
    },
    slow_sql: {
        enabled: true
    },
    rules: {
        name: [{
            pattern: '/api/v1/',
            name: '/api/v1/',
            precedence: 1,
            terminate_chain: true,
            replace_all: false
        }]
    },
    transaction_events: {
        enabled : true,
        max_samples_per_minute : 5000,
        max_samples_stored : 20000
    },
    transaction_tracer : {
        enabled: true
    }
};
