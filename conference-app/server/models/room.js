const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//=====================
// Room Schema
//=====================

const RoomSchema = new Schema({
    room: {
        type: String,
        unique: true,
        required: true
    },
    sessionID: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Room', RoomSchema);