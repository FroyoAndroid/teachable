const express = require('express'),
        sessionController = require('./controllers/session.controller'); 

module.exports = (app) => {

    const sessionRoute = express.Router();

    app.use('/session', sessionController.create);
    app.use('/', (request, response) => {
        return response.status(200).send('Welecom to TokboxAPI');
    });
};