var google = require('googleapis'),
    OAuth2 = google.auth.OAuth2,
    redis = require('../common/redis-service'),
    fs = require("fs"),
    bluebird = require('bluebird'),
    AuthorizationManager = require('../common/auth.js'),
    authSvc = new AuthorizationManager(OAuth2),
    DbManager = require(global.relSrcPath + "/db/mongooseDbManager.js"),
    tokenModel = require(global.relSrcPath + "/models/token.js")
dbMngr = new DbManager('register'),
    tableName = 'token_tbl';
var GDriveOAuth = function () {
    var oAuthToken, oAuthClient,
        storeTokenToDb = (tokenObj, tokenModel, res) => {
            return dbMngr.connect()
                .then(function (resp) {
                    if (resp) {
                        // fetch docs
                        dbMngr.insertDoc(tokenModel, tokenObj)
                            .then(docs => {
                                return docs;
                            });
                    }
                })
                .catch(function (err) {
                    console.error('Db connectivity failed');
                    return err;
                });

        }

    function GDriveOAuth() {
    }
    this.testoAuth = (req, res, next) => {
        var url = authSvc.getAuthUrl();
        res.send(url);

    }
    this.getCode = (url, req, res, next) => {
        req.get(url, function (err, res, body) {
            if (err) {
                next(err);
            } else {
                next(res)
            }

        });
    }
    this.createToken = function (req, res, next) {
        oAuthClient = oauth2Client = authSvc.getOAuthClient(),
            session = req.session,
            code = req.query.code;
        oauth2Client.getToken(code, function (err, tokens) {
            // Now tokens contains an access_token and an optional refresh_token. Save them.

            if (!err) {
                oauth2Client.refreshAccessToken(function (err, refTokens) {
                    // your access_token is now refreshed and stored in oauth2Client
                    // store these new tokens in a safe place (e.g. database)
                    tokens.refresh_token = tokens.access_token;
                    tokens.userId = 'abc';
                    redis.set('token_' + tokens.userId,
                        JSON.stringify(tokens), 5000);
                    res.send('Login success');

                });

            }
            else {
                res.send(`
                    &lt;h3&gt;Login failed!!&lt;/h3&gt;
                `);
            }
        });

    }
    this.uploadData = function (req, res, next) {
        // set auth as a global default
        // google.options({
        //     auth: oAuthClient
        // });
        var oauth2Client = authSvc.getOAuthClient();
        //get token details from cache
        redis.get('token_abc', function (err, tokens) {
            if(err) res.status(404).send('token not found');
            oauth2Client.setCredentials(JSON.parse(tokens));
            var drive = google.drive({ version: 'v3', auth: oauth2Client });
            var fileMetadata = {
                'name': req.params['filename']
            };
            var media = {
                mimeType: 'image/png',
                body: fs.createReadStream(`../BackEndServer/files/${req.params['filename']}`)
            };
            var reqUrl = drive.files.create({
                resource: fileMetadata,
                media: media,
                fields: 'id'
            }, function (err, file) {
                if (err) {
                    // Handle error
                    console.log(err);
                    res.status(400).send('Upload error' + err);
                } else {

                    console.log('File Id: ', file.id);
                    res.status(200).send('File successfully uploaded with id:' + file.id)
                }
            });
           console.info(reqUrl.uri.href)

        });

    }
    this.listData = (req, res, next) => {
        var drive = google.drive({ version: 'v2', auth: oAuthClient });
        drive.files.list("mimeType='image/jpg'", function (data) {
            console.info(data);
        });
    }
}

var gDriveAuthObj = new GDriveOAuth();

module.exports = function (router) {
    // /acoount/oAuth
    router.get('/', gDriveAuthObj.testoAuth);
    // /acoount/oAuth/token
    router.get('/token', gDriveAuthObj.createToken);
    // /account/uload
    router.post('/upload/:filename', gDriveAuthObj.uploadData);
    // /account/list
    router.get('/list', gDriveAuthObj.listData);
    return router;
}