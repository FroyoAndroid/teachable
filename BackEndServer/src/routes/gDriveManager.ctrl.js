var google = require('googleapis'),
    OAuth2 = google.auth.OAuth2,
    redis = require('../common/redis-service'),
    fs = require("fs"),
    path = require('path'),
    bluebird = require('bluebird'),
    AuthorizationManager = require('../common/auth.js'),
    authSvc = new AuthorizationManager(OAuth2),
    promiseNode = require('promisify-node'),
    fs_promisified = promiseNode('fs'),
    DbManager = require(global.relSrcPath + "/db/mongooseDbManager.js"),
    tokenModel = require(global.relSrcPath + "/models/token.js"),
    dbMngr = new DbManager('register'),
    tableName = 'token_tbl',
    UploadManagerSvc = require('../common/uploadManager.svc.js');
var GDriveManager = function () {
    var oAuthToken, oAuthClient,
        oauth2Client = authSvc.getOAuthClient(),
        getConfiguredDrive = (oauth2Client, driveVersion) => {
            return google.drive({
                version: driveVersion,
                auth: oauth2Client
            });
        };
    this.testoAuth = (req, res, next) => {
        var url = authSvc.getAuthUrl();
        res.send(url);

    }
    this.createToken = function (req, res, next) {

        var session = req.session,
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

            } else {
                res.send(`
                    &lt;h3&gt;Login failed!!&lt;/h3&gt;
                `);
            }
        });

    }
    this.uploadData = function (req, res, next) {

        var oauth2Client = authSvc.getOAuthClient();
        //get token details from cache
        redis.get('token_abc', function (err, tokens) {
            if (err || !tokens) res.status(404).send('token not found');
            else {
                oauth2Client.setCredentials(JSON.parse(tokens));
                var uploadMgr = new UploadManagerSvc(google, oauth2Client, fs_promisified, path);
                uploadMgr.upload(req.params['filename'])
            }
        });

    }
    /**
     *
     * https://content.googleapis.com/drive/v3/files?key=AIzaSyD-a9IF8KKYgoC3cpgS-Al7hLQDbugrDcw
        :method:GET
        authorization:Bearer ya29.Glu3BNnv2kI99EyJ02o5i7VgpCWLp4sZTYc3Jg-4a5-Te3Ef01knR_oXMXLtXBz5UwPKCEyUFK2KkOaFEZqBk5livbowVny-TvGHzoYx65CjNVuQVfM_Huqz37wo
        x-origin:https://explorer.apis.google.com
        x-referer:https://explorer.apis.google.com
     */
    this.listData = (req, res, next) => {
        var oauth2Client = authSvc.getOAuthClient();
        redis.get('token_abc', function (err, tokens) {
            if (err || !tokens) res.status(404).send('token not found');
            else {
                // req.get("https://content.googleapis.com/drive/v3/files?key=AIzaSyD-a9IF8KKYgoC3cpgS-Al7hLQDbugrDcw",
                // {
                //     ":scheme":"https",
                //     "authorization": "Bearer ya29.Glu3BNnv2kI99EyJ02o5i7VgpCWLp4sZTYc3Jg-4a5-Te3Ef01knR_oXMXLtXBz5UwPKCEyUFK2KkOaFEZqBk5livbowVny-TvGHzoYx65CjNVuQVfM_Huqz37wo",
                //     "x-origin": "https://explorer.apis.google.com",
                //     "x-referer": "https://explorer.apis.google.com"
                // }, function (err, response) {
                //     console.log(response);
                // })
                oauth2Client.setCredentials(JSON.parse(tokens));
                var drive = getConfiguredDrive(oauth2Client, 'v3');
                drive.files.list({
                    pageSize: 10
                }, function (data) {
                    if (!global.resBody) res.status(400).send([]);
                    else
                        res.status(200).send(global.resBody.files);
                });
            }

        });

    }
    this.getData = (req, res, next) => {

        redis.get('token_abc', function (err, tokens) {
            if (err || !tokens) res.status(404).send('token not found');
            else {
                oauth2Client.setCredentials(JSON.parse(tokens));
                var drive = getConfiguredDrive(oauth2Client, 'v3');
                drive.files.get({ fileId: req.params["fileId"] }, function (data) {
                    if (!global.resBody) res.status(400).send('File Not found');
                    else
                        res.status(200).send(global.resBody);
                });
            }
        });

    }
    this.downloadFile = (req, res, next) => {
        var dest = fs.createWriteStream(`/tmp/photo${Math.random() * 100}.jpg`);
        redis.get('token_abc', function (err, tokens) {
            if (err || !tokens) res.status(404).send('token not found');
            else {
                oauth2Client.setCredentials(JSON.parse(tokens));
                var drive = getConfiguredDrive(oauth2Client, 'v3');
                drive.files.get({
                    fileId: req.params["fileId"],
                    alt: 'media'
                })
                .on('end', function () {
                    res.send('Download Done');
                })
                .on('error', function (err) {
                    res.send('Error during download', err);
                })
                .pipe(dest);
            }

        });

    }
}

var gDriveAuthObj = new GDriveManager();

module.exports = function (router) {
    // /acoount/oAuth
    router.get('/', gDriveAuthObj.testoAuth);
    // /acoount/oAuth/token
    router.get('/token', gDriveAuthObj.createToken);
    // /account/uload
    router.post('/upload/:filename', gDriveAuthObj.uploadData);
    // /account/oauth/list
    router.get('/list', gDriveAuthObj.listData);
    // /account/oauth/get
    router.get('/download/:fileId', gDriveAuthObj.downloadFile);
    return router;
}