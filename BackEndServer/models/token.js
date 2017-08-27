/**
 * 
 *  access_token:"ya29.Gly0BMQg56KvzFNYg0FhPjNyJrJwgRAkwusKDBVJ74IHaNis0hgXF-rGeW3r3sK05SWBy6KMYXfIS-LsPHQxdAQ3X54XX1f1kl3tgEAk6zPjdNeyuYTI6YX3MkKlLA"
    expiry_date:1503846915854
    refresh_token:"ya29.Gly0BMQg56KvzFNYg0FhPjNyJrJwgRAkwusKDBVJ74IHaNis0hgXF-rGeW3r3sK05SWBy6KMYXfIS-LsPHQxdAQ3X54XX1f1kl3tgEAk6zPjdNeyuYTI6YX3MkKlLA"
    token_type:"Bearer"
    userId:"abc"
 */
var mongoose=require('mongoose'),
    Schema = mongoose.Schema,
    tokenSchema = new Schema({
    access_token: { type: String, required: true},
    refresh_token: { type: String, required: true},
    id_token: { type: String, required: true},
    expiry_date: { type: Number, required: true },
    token_type: {type: String},
    userId:{type: String}
});

var Token = mongoose.model('Token', tokenSchema);
module.exports = Token;