const config = require('../config/config'),
    Room = require('../models/room');

exports.createRoom = (roomName, sessionID) => {

    let room = new Room({
        room: roomName,
        sessionID: sessionID
    });

    return room.save();
};

exports.getRoom = (roomId) => {
    let query = Room.find({
        "_id": roomId
    });
    return query.exec();
};

exports.getAllRoom = () => {
    let query = Room.find({});
    return query.exec();
};