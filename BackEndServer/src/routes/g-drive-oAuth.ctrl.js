var google = require('googleapis'),
    OAuth2 = google.auth.OAuth2,
    fs = require("fs"),
    bluebird = require('bluebird'),
    AuthorizationManager = require('../common/auth.js'),
    authSvc = new AuthorizationManager(OAuth2);
var GDriveOAuth = function () {
    var oAuthToken, oAuthClient;

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
                    oauth2Client.setCredentials(tokens);
                    //saving the token to current session
                    //session["tokens"] = tokens;
                    oAuthToken = tokens;
                    res.send(`
                    &lt;h3&gt;Login successful!!&lt;/h3&gt;
                    &lt;a href="/details"&gt;Go to details page&lt;/a&gt;
                `);
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
        google.options({
            auth: oAuthClient
        });
        var drive = google.drive({ version: 'v3', auth: oAuthClient });
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
            } else {

                console.log('File Id: ', file.id);
                res.status(200).send('File successfully uploaded with id:',file.id)
            }
        });
        console.info(reqUrl.uri.href)
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
    return router;
}