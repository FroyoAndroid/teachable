var DbManager = require(global.relSrcPath+"/db/mongooseDbManager.js"),
    userModel = require(global.relSrcPath+"/models/user.js")
dbMngr = new DbManager('register'),
    tableName = 'Registration_tbl';


function validateUser(req, res, next) {
    dbMngr.connect()
        .then(function (resp) {
            if (resp) {
                // fetch docs
                dbMngr.searchDoc(userModel, req.body)
                    .then(docs => {
                        if (docs) {
                            res.status(200).send("Successfully Logged In");
                        }
                    })
                    .catch(err => {
                        res.status(404).send('Invalid Username or Password');
                    })
            }
        })
        .catch(function (err) {
            console.error('Db connectivity failed');
        });
}

module.exports = function (router) {
    // /acoount/register
    router.post('/', validateUser);
    return router;
}