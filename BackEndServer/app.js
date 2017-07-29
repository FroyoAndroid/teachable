var express = require('express'),
  bodyParser = require('body-parser'),
  // instance of express library
  // Using the body parser
  app = express(),
  fs = require('fs'),
  nconf = require('nconf');

//Setting up configuration ovbject of our project through nconf
// optional config for developer convenience
var localConfigFile = __dirname + '/config/config-local.json';
if (fs.existsSync(localConfigFile)) {
  var configFileContents = JSON.parse(fs.readFileSync(localConfigFile));
  nconf.overrides(configFileContents);
  console.log('::LOCAL:: found config overrides in config-local.json!!');
}



// app.use('Whatever u need to use')
app.use(bodyParser.json()); // support json encoded bodies

//Setting up the parent root of our application
// Routers
var rootRouter = express.Router();
app.use('/account', rootRouter);


// Register the children with the root Router
// /account/register
var registerRouterModule = require('./src/routes/register.ctrl.js'),
  registerRouter = registerRouterModule(express.Router());
// Registering parent router with the child router
// /account/register
rootRouter.use('/register', registerRouter);





/**
 *  /account/login
 */

/**
 *  /account/logout
 */
// var server = app.listen(3008);
// server.on('error', function () {
//   console.info('Cant run on the above');
// });
// server.on('listening', function () {
//   console.info('Server listening');
// })
module.exports = app;