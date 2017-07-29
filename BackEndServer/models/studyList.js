var mongoose=require('mongoose'),
    Schema = mongoose.Schema,
    studySchema = new Schema({
    userName : { type: String, required: true},
    PatientName: String,
    MRN: { type: String, required: true },
    AccessionNo: { type: String, required: true, unique: true },
    StudyDate: {type: String}
    });
var StudyList = mongoose.model('StudyList', studySchema);
module.exports = StudyList;