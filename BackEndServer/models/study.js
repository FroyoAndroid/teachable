/**
 *  |---STUDY 01
    |---STUDY-LEVEL HEADER (e.g. MRN, ACC, date, etc)
    |---SERIES 01
        |---SERIES-LEVEL HEADER (acquisition, etc)
        |---URL TO DATA: 2D or 3D VOLUME
        |---URL TO MASK: 2D or 3D VOLUME(S)

    |---SERIES 02
    |---SERIES 03
|---STUDY 02
|---STUDY 03

 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    studySchema = new Schema({
        userName: {
            type: String,
            required: true
        },
        hospitalName: {
            type: String,
            required: true
        },
        PatientName: String,
        studyList: [{
            series: [{

                MRN: {
                    type: String,
                    required: true
                },
                AccessionNo: {
                    type: String,
                    required: true
                },
                StudyDate: {
                    type: String
                },
                images: []
            }]
        }]
    });
var Study = mongoose.model('Study', studySchema);
module.exports = Study;