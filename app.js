'use strict'
require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
//const login = require('./routes/login');
const enps = require('./routes/enpsapi');
const favicon = require('serve-favicon');
const middleware = require('./middleware');
const config = require('./config');
const index = require('./routes/index');
var chokidar = require('chokidar');
var asrun_path = require('path');

var app = express();

//setup favicon
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

//engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//CONFIGURE ROUTES
// app.use('/api/v1/', enps);
// app.use('/login', login);
app.use('/', index);

//configure logging
app.use(middleware.expresslogger);

// catch 404 and forward to error handler
app.use(function(err, req, res) {
    middleware.logger.error({
      'Main Error Handling': err.statusCode,
      'originalUrl' : err.originalUrl
    });
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
    var port = server.address().port;
    middleware.logger.info('Running on http://localhost:', port);
});

middleware.mongo.testConnection();
var folderAsRun = "C:/Users/jferraro/Documents/Test_AsRun/**.asr" || process.env.WATCHPATH;
var watcher = chokidar.watch(folderAsRun, {ignored: /^\./, persistent: true});
//START UP FILE WATCHER FOR SPECIFIC PATH. TAKE FILES AND ADD THEM TO MONGO
watcher
  .on('add', function(path) {
    // try {
      middleware.logger.info('File', path, 'has been added');
    //   var lineReader = require('readline').createInterface({
    //     input: require('fs').createReadStream(path)
    //   });
    //   var myArray = [];
    //   lineReader.on('line', function (l) {
    //     l.toString();
    //     // ADD FUNCTION===if first line of asr file is not correct stop processing
    //     if(path.includes('WRNN')){
    //       myArray.push({
    //         "date" : l.substring(25,35),
    //         "time" : l.substring(35,46),
    //         "mos" : l.substring(46,56),
    //         "slug" : l.substring(126,176),
    //         "slug2" : l.substring(176,217),
    //         "vs" : l.substring(226,231),
    //         "vs2" : l.substring(246,251),
    //         "duration" : l.substring(461,472)
    //       });
    //     }
    //     else {
    //       myArray.push({
    //         "date" : l.substring(25,35),
    //         "time" : l.substring(35,46),
    //         "mos" : l.substring(46,55),
    //         "slug" : l.substring(126,176),
    //         "slug2" : l.substring(176,217),
    //         "vs" : l.substring(226,231),
    //         "duration" : l.substring(461,472)
    //       });
    //     }
    //   });
    //   lineReader.on('close', function(){
    //     var enpspath;
    //     var asrunName = asrun_path.basename(path);
    //     middleware.mongo.insertDocs(myArray, asrunName, 'AsRuns');
    //     if(asrunName.includes('FIOSL')){
    //       enpspath = 'LIFIOS';
    //       middleware.grabRundowns.run(enpspath, asrunName);
    //     } else if(asrunName.includes('FIOSN')){
    //       enpspath = 'NJFIOS';
    //       middleware.grabRundowns.run(enpspath, asrunName);
    //     } else if(asrunName.includes('FIOSH')){
    //       enpspath = 'HVFIOS';
    //       // middleware.grabRundowns.run(enpspath, asrunName);
    //     } else if(asrunName.includes('WRNN')){
    //       middleware.logger.info('Done, no rundowns to collect for RNN');
    //     }
    //     middleware.grabRundowns.runGrid('DESK', asrunName);
    //   });
    // } catch (err){
    //   middleware.logger.error(err);
    //   middleware.zapier.WebHook(err, 'mail');
    // }
  })
  .on('change', function(path) {middleware.logger.info('File', path, 'has been changed');})
  .on('unlink', function(path) {middleware.logger.info('File', path, 'has been removed');})
  .on('error', function(error) {middleware.logger.error('Error happened', error);});

//ACTIONS TO DO WHEN SHUTDOWN IS SENT TO THE SERVER.
process.on('SIGINT', function() {
    middleware.logger.info('SIGINT Received .. shutting down');
    // My process has received a SIGINT signal
    // Meaning PM2 is now trying to stop the process
    // So I can clean some stuff before the final stop
    process.exit(0);
});

module.exports = app;
