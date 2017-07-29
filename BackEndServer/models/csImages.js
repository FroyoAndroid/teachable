
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var csImagesSchema = new Schema({
  imgName: String,
  imgString: String,
  username: String,
  created_at: Date,
  updated_at: Date
});

// the schema is useless so far
// we need to create a model using it
var csImages = mongoose.model('csImages', csImagesSchema);

// make this available to our users in our Node applications
module.exports = csImages;