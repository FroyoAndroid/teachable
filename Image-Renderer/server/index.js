const express = require('express')
const app = express()
const path = require('path')

const bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', require('./routes'))

app.listen(8080)