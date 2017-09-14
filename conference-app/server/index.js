// var OpenTok = require('opentok'),
// opentok = new OpenTok(apiKey, apiSecret);
const express = require('express'),
    app = express(),
    favicon = require('serve-favicon'),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    config = require('./config/config'),
    log = console.log,
    router = require('./router');

const server = app.listen(config.port);
log(`Server is running on port ${config.port}`);

// Setting up basic middleware for all Express requests
app.use(logger('dev'));// Log requests to API using morgan
app.use(bodyParser.json());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
router(app);

