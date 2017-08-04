var DbManager = require("d:/xampp/htdocs/myProjects/radiologyproject/BackEndServer/db/mongooseDbManager.js"),
    userModel = require("d:/xampp/htdocs/myProjects/radiologyproject/BackEndServer/models/user.js")
dbMngr = new DbManager('register'),
    tableName = 'reg_tbl',
    bcrypt = require('bcrypt'),
    sendmail = require('sendmail');

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
                            let transporter = nodemailer.createTransport({
                                host: 'smtp.example.com',
                                port: 465,
                                secure: true, // secure:true for port 465, secure:false for port 587
                                auth: {
                                    user: 'username@example.com',
                                    pass: 'userpass'
                                }
                            });

                            // setup email data with unicode symbols
                            let mailOptions = {
                                from: 'ghosesoumya001@gmail.com', // sender address
                                to: 'ghoshsoumya001@gmail.com', // list of receivers
                                subject: 'Registration', // Subject line
                                text: 'Status of Registration', // plain text body
                                html: '<b>Successfully Registered</b>' // html body
                            };

                            // send mail with defined transport object
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    return console.log(error);
                                }
                                console.log('Message %s sent: %s', info.messageId, info.response);
                            });

                        })
                        .catch(err => {
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