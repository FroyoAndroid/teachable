var nconf = require('nconf'),
    clientDetails = nconf.get('clientDetails');


var AuthorizationManager = function (OAuth2) {
    // OAuth2 = google.auth.OAuth2;
    var _oAuth = OAuth2;
    // function AuthorizationManager(OAuth2) {
    //     _oAuth = OAuth2;
    // }
    var getOAuthClient = () => {
        return new _oAuth(clientDetails.clientId, clientDetails.clientSecret, clientDetails.redirectUrl);
    }

     this.getAuthUrl = () => {
        var oauth2Client = getOAuthClient();
        // generate a url that asks permissions for Google+ and Google Calendar scopes
        var url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: clientDetails.scopes // If you only need one scope you can pass it as string
        });

        return url;
    }

}
module.exports = AuthorizationManager;