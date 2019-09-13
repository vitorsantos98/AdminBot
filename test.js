const express = require('express');
const pug = require('pug');
const helmet = require('helmet');
const app = express();
const bodyParser = require('body-parser');
const Rcontest = require('./RCON');
app.use(bodyParser.json());

//router
require('./site.route.js')(app);

//express settings
app.use(helmet());
app.set('view engine', 'pug');
app.set('views', 'views');
if (app.get('env') === 'development') {
  app.locals.pretty = true;
}



  Rcontest.sendRcon('192.168.1.67', "12205", '', 'getstatus');