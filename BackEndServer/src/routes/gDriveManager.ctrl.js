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
    tableName = 'token_tbl';
var GDriveManager = function () {
    var oAuthToken, oAuthClient,
        uploadData = (drive, fileDetails, res) => {
            var reqUrl = drive.files.create(fileDetails,
                function (err, file) {
                    if (err) {
                        // Handle error
                        console.log(err);
                        //res.status(400).send('Upload error' + err);
                    } else {
                        console.log('File Id: ', file.id);
                       // res.status(200).send('File successfully uploaded with id:' + file.id)
                    }
                });
            console.info(reqUrl.uri.href)
        },
        generateFileDetails = (file, parentPath, parentFolderId) => {
            var fileMetadata = {
                    'name': file,
                    parents: [parentFolderId]
                },
                fileExt = path.extname(file),
                mime = (/\.(dcm|jpg|jpeg|nifti|png)$/i).test(file) ? `image/${fileExt.substring(1)}` : '';
            var media = {
                mimeType: mime,
                body: fs.createReadStream(`${parentPath}/${file}`)
            };
            return {
                resource: fileMetadata,
                media: media,
                fields: 'id'
            };
        }

    function GDriveOAuth() {}
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
        var fileMetadata = {
                'name': req.params['filename'],
                'mimeType': 'application/vnd.google-apps.folder'
            },
            parentPath = `../BackEndServer/files/${req.params['filename']}`;
        redis.get('token_abc', function (err, tokens) {
            if (err) res.status(404).send('token not found');
            oauth2Client.setCredentials(JSON.parse(tokens));
            var drive = google.drive({
                version: 'v3',
                auth: oauth2Client
            });
            var reqUrl = drive.files.create({
                    resource: fileMetadata,
                    fields: 'id'
                },
                function (err, file) {
                    if (err) console.error('Upload folder err');
                    else {
                        var parentFolderId = file.id;
                        res.status(200).send('File successfully uploaded with id:' + file.id)
                        fs_promisified.readdir(parentPath)
                            .then(files => {
                                files.forEach((file, index) => {
                                    var fileDetais = generateFileDetails(file, parentPath, parentFolderId);
                                    console.info(file);
                                    uploadData(drive, fileDetais, res)
                                });
                            })
                            .catch(err => {
                                console.error(err);
                            });
                    }
                });
            console.info(reqUrl.uri.href)

        });

    }
    this.listData = (req, res, next) => {
        var oauth2Client = authSvc.getOAuthClient();
        redis.get('token_abc', function (err, tokens) {
            if (err) res.status(404).send('token not found');
            oauth2Client.setCredentials(JSON.parse(tokens));
            var drive = google.drive({
                version: 'v3',
                auth: oauth2Client
            });
            drive.files.list("mimeType='image/jpg'", function (data) {
                console.info(data);
                if (data === null) res.status(400).send([]);
            });
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
    // /account/list
    router.get('/list', gDriveAuthObj.listData);
    return router;
}