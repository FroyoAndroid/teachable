const express = require('express'),
        sessionController = require('./controllers/session.controller');

module.exports = (app) => {

    const sessionRoute = express.Router();

    sessionRoute.get('/', sessionController.getAllRoom);

    sessionRoute.post('/', sessionController.createRoom);

    sessionRoute.get('/:roomID', sessionController.getSessionInfoForRoom);

    sessionRoute.post('/token', sessionController.createToken);

    app.use('/rooms', sessionRoute);

    app.use('/', (request, response) => {
        return response.status(200).send('Welecom to TokboxAPI');
    });
};