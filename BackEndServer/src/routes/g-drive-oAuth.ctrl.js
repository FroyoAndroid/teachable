var google = require('googleapis'),
    OAuth2 = google.auth.OAuth2,
    AuthorizationManager = require('../common/auth.js'),
    authSvc = new AuthorizationManager(OAuth2);
var GDriveOAuth = function () {
    function GDriveOAuth() {
    }
    this.testoAuth = (req,res,next) => {
        var url = authSvc.getAuthUrl();
        res.send('Welcme to Google-Drive: '+url)
    }
}


module.exports = function (router) {
    // /acoount/oAuth
    router.get('/', new GDriveOAuth().testoAuth);
    return router;
}