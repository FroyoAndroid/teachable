var mongoose=require('mongoose'),
    Schema = mongoose.Schema,
    userSchema = new Schema({
    name: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: {type: String, required: true},
    hospital: {type: String},
    created_at: Date,
    updated_at: Date
    });
var User = mongoose.model('User', userSchema);
module.exports = User;