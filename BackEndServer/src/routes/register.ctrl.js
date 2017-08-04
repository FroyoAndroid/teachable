var DbManager = require("d:/xampp/htdocs/myProjects/radiologyproject/BackEndServer/db/mongooseDbManager.js"),
    userModel = require("d:/xampp/htdocs/myProjects/radiologyproject/BackEndServer/models/user.js")
dbMngr = new DbManager('register'),
    tableName = 'reg_tbl',
    bcrypt = require('bcrypt'),
    sendmail = require('sendmail'),
    nodemailer = require('nodemailer'),
    EmailService = require('../common/mail-service');

function getRegisterUsers(req, res, next) {
    console.info('RegisteringInside GET  /account/register');

    // Save user details inside DB
    dbMngr.connect()
        .then(function (resp) {
            if (resp) {
                // fetch docs
                dbMngr.fetchDoc(userModel, req.query)
                    .then(docs => {
                        res.send(docs);
                    });
            }
        })
        .catch(function (err) {
            console.error('Db connectivity failed');
        });
}

function getuser(req, res, next) {
    console.info(req);
}

function registerUser(req, res, next) {
    console.info(__dirname);
    dbMngr.connect(tableName)
        .then(function (resp) {
            if (resp) {
                var response = req.body,
                    saltRounds = 10,
                    userMail = response.email;
                response.created_at = new Date();
                response.updated_at = new Date();
                //encrypt password
                bcrypt.hash(response.password, saltRounds).then(function (hash) {
                    response.password = hash;
                    // Store hash in your password DB.
                    dbMngr.insertDoc(userModel, response)
                        .then(docs => {
                            var emailObj = new EmailService(nodemailer);
                            // sender, receiver, mailSubject, content, htmlContent
                            emailObj.sendMail('ghosesoumya001@gmail.com', userMail,
                             `Registration notification`, `Registration of ${userMail} Successfull`, `<h1> Welcome to radiology app</h1>`)
                                .then(mailRes => {
                                    console.info(mailRes);
                                   var response = {
                                       "msg" : 'User Registered. A mail sent to your account',
                                       "from" : mailRes.envelope.from,
                                       "messageId" : mailRes.messageId,
                                       "status" : "200 OK"
                                   }
                                    res.status(200).send(response);
                                })
                                .catch(err => {
                                    res.status(500).send(err);
                                });
                        })
                        .catch(err => {
                            console.error(err)
                            res.status(500).send('Error in db insertion');
                        })
                });

            }
        })
        .catch(function (err) {
            console.error('Db connectivity failed');
        });
}

function validateUser(req, resp, next) {
    console.info('VALIDATING : Inside GET  /account/register/validate');
    next();
}

function validateUserInfo(req, res, next) {

}

module.exports = function (router) {
    // /acoount/register
    router.post('/', registerUser);
    router.get('/', getRegisterUsers);
    return router;
}