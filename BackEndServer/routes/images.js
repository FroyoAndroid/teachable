var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var fs = require('fs');


/* GET images listing. */
router.get('/getImages', function(req, res, next) {
	mongoose.model('csImages').find({
		//condition if needed
	}, function(err,imageRes) {
		if (!err) {
			res.format({
				json: function() {
					res.json(imageRes);
				}
			});
		} else {
			res.format({
				json: function() {
					res.json({
						error:true,
						msg:"Something went wrong"
					});
				}
			});
		}
	});

});


router.post('/addImages', function(req, res, next) {
	//Hardcoded Image for the time being. will be replaced 
	var b64Image = "AgACAAUACQAGAAAAAwAEAAUAAwAEAAgACAAEAAQABgAEAAMAAgAFAAMAAgAHAA8ACAAPABgAGQAzAEgAUABRAFMATwBOAE8AQQA1AD0AQgAsABMAGQAuADcAOAA7ADkALAAZAB0AOABGAD4AKAAJAA0AOgBPADkAOABBADsANwA7ADsAOAA0ADYAOwA8AD0AQABAADoAMgAwAC8AMAAxADIANAA4ADoARABPAFAATABHAD0AOwBDAEUAQABBAEQAQgA";
	var imgName = "csImage.jpg";
	var username = "username";
	//add data in mongo
	mongoose.model('csImages').create({
		imgName: imgName,
		imgString: b64Image,
		username: username,
		created_at: new Date(),
		updated_at: new Date()
	}, function(err,imageRes) {
		console.log('mongo execution done');
		if (!err) {
			res.format({
				json: function() {
					res.json(imageRes);
				}
			});
		} else {
			res.format({
				json: function() {
					res.json({
						error:true,
						msg:"Something went wrong"
					});
				}
			});
		}
	});
});

module.exports = router;