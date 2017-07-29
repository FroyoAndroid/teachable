var DbManager = require("d:/xampp/htdocs/myProjects/radiologyproject/BackEndServer/db/mongooseDbManager.js"),
    studyModel = require("d:/xampp/htdocs/myProjects/radiologyproject/BackEndServer/models/studyList.js")
dbMngr = new DbManager('study'),
    tableName = 'studyList_tbl';

function getAllPatientList(req, res, next) {
    dbMngr.connect()
        .then(function (resp) {
            if (resp) {
                // fetch docs
                dbMngr.fetchDoc(studyModel)
                    .then(docs => {
                        res.send(docs);
                    });
            }
        })
        .catch(function (err) {
            console.error('Db connectivity failed');
        });
}


function savePatientData(req, res, next) {
    // Save patients details inside DB
    dbMngr.connect(tableName)
        .then(function (resp) {
            if (resp) {
                var response = req.body;
                response.StudyDate = new Date();
                // fetch docs
                dbMngr.insertDoc(studyModel, response)
                    .then(docs => {
                        res.send("Patient Info Successfully Inserted");
                    });
            }
        })
        .catch(function (err) {
            console.error('Db connectivity failed');
        });
}

function getPatientList(req, res, next) {
     dbMngr.connect()
        .then(function (resp) {
            if (resp) {
                // fetch docs
                dbMngr.fetchDoc(studyModel, req.params)
                    .then(docs => {
                        res.send(docs);
                    });
            }
        })
        .catch(function (err) {
            console.error('Db connectivity failed');
        });
}

module.exports = function (router) {
    // /acoount/study
    router.post('/', savePatientData);
    router.get('/', getAllPatientList);
    router.get('/user/:userName', getPatientList);
    return router;
};