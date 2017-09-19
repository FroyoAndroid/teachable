const OpenTok = require('opentok'),
    config = require('../config/config'),
    opentok = new OpenTok(config.apiKey, config.apiSecret),
    dbController = require('./database.controller'),
    log = console.log;


exports.createRoom = (req, res) => {
    let roomName = req.body.roomName;
    try {
        if (roomName) {
            opentok.createSession((err, session) => {
                if (err) {
                    return res.status(500).send({
                        'message': 'Session creation error'
                    });
                } else {
                    dbController.createRoom(roomName, session.sessionId)
                        .then(function (room) {
                            return res.status(201).send({
                                'roomID': room._doc._id.toString(),
                                'room': room._doc.room,
                                'sessionID': room._doc.sessionID
                            });
                        })
                        .catch(function (error) {
                            return res.status(403).send({
                                'error': error
                            });
                        });
                }

            });
        } else {
            return res.status(403).send({
                'error': "Room Name not provided."
            });
        }
    } catch (error) {
        return res.status(403).send({
            'error': error
        });
    }

};

exports.createToken = (req, res, next) => {

    let sessionId = req.body.sessionID;
    let tokenType = req.body.tokenType;
    let username = req.body.username || '';

    if (sessionId && sessionId !== '') {
        let tokenOptions = {
            role: tokenType || 'subscriber',
            data: `username=${username}`
        };

        token = opentok.generateToken(sessionId, tokenOptions);

        if (token) {
            return res.status(200).send({
                'sessionID': sessionId,
                'token': token
            });
        }
    } else {
        return res.status(403).send({
            'error': 'session id not provided'
        });
    }

};

exports.getSessionInfoForRoom = (req, res, next) => {
    var roomId = req.params.roomID;
    if (roomId) {
        dbController.getRoom(roomId)
            .then(function (rooms) {
                let room = rooms[0];
                return res.status(200).send({
                    'roomID': room._doc._id.toString(),
                    'room': room._doc.room,
                    'sessionID': room._doc.sessionID
                });
            })
            .catch(function (error) {
                return res.status(200).send({});
            });
    } else {
        return res.status(200).send({});
    }
};

exports.getAllRoom = (req, res) => {
    dbController.getAllRoom()
        .then((rooms) => {
            return res.status(200).send(rooms);
        })
        .catch((error) => {
            return res.status(403).send({
                'error': 'No Rooms'
            });
        });
};