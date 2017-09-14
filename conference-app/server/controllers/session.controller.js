const OpenTok = require('opentok'),
    config = require('../config/config'),
    opentok = new OpenTok(config.apiKey, config.apiSecret);


exports.create = (req, res, next) => {
    opentok.createSession(function (err, session) {
        if (err) {
            return res.status(500).send({
                'message': 'Session creation error'
            });
        } else {
            return res.status(201).send({
                'session-id': session.sessionId
            });
        }
        // save the sessionId
        //db.save('session', session.sessionId, done);
    });
};