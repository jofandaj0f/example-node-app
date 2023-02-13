'use strict';

// const newrelic = require('newrelic');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
//const login = require('./routes/login');
const favicon = require('serve-favicon');
const middleware = require('./middleware');
const config = require('./config');
const test = require('./test');
const index = require('./routes/index');
const mcs = require('./routes/mcs');
// Import events module
//var events = require('events');
// Create an eventEmitter object
//var eventEmitter = new events.EventEmitter();
// var io = require('socket.io');

var app = express();

//setup favicon
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

//engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('partials', path.join(__dirname, 'views/partials'));
// app.use('/public', express.static('public'));
// app.set('view engine', 'ejs');
// app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//CONFIGURE ROUTES
app.use('/mcs', mcs);
//app.use('/login', login);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(err, req, res) {
    // console.log(res);
    if(res.statusCode === 500){
        return 'Error 500';
    }
    else if(res.statusCode === 404){
        return err;
    }
});
//Datadog and New Relic reporting
// app.locals.newrelic = newrelic;

//SPIN UP THE SERVER
var server = app.listen(3000, function() {
    //var host = process.env.DB_URL || 'vision';
    var port = server.address().port;
    
    middleware.logger.info({
        level: 'info',
        message: `Running on http://localhost:${port}`
    });
});
//Listener for events on socket.io
//Commented out since no need at the moment
// var listener = io.listen(server);
// listener.sockets.on('connection', function(socket){
//   socket.emit('message', {'message' : 'Connected to App'});
// });

// listener.sockets.on('error', function (exception) {
//    return middleware.logger.info('error event in socket.send(): ' + exception);
// });
// var emitter = getMetricEmitter();
// if (emitter.gcEnabled) {
//   emitter.on('gc', (gc) => middleware.logger.debug(gc.type + ': ' + gc.duration));
// }
// if (emitter.usageEnabled) {
//   emitter.on('usage', (usage) => middleware.logger.debug('ru'));
// }
// if (emitter.loopEnabled) {
//   setInterval(function printLoopMetrics() {
//     var loopMetrics = emitter.getLoopMetrics();
//     middleware.logger.debug("Loop time:", loopMetrics.loop);
//     middleware.logger.debug("IO wait time:", loopMetrics.ioWait);
//   }, 1000);
// }
//ACTIONS TO DO WHEN SHUTDOWN IS SENT TO THE SERVER.
process.on('SIGINT', function() {

    
    // My process has received a SIGINT signal
    // Meaning PM2 is now trying to stop the process
    // So I can clean some stuff before the final stop

    process.exit(0);
});

module.exports = app;
