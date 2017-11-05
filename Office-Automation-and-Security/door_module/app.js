//written by Shubham  Kumar
//Read readme.txt for running this application.
//This file has codes for routing files, connecting to mongoDB server and setting up view engine.

var express=require('express');
var path = require('path');
var consolidate = require('consolidate');
var app = express();
var port = 4000;

var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//requiring js files to render different html pages.
var index = require('./routes/index');
var register = require('./routes/register');
var rfidstatus = require('./routes/rfidstatus');
var availability = require('./routes/availability');

//connecting to database
mongoose.Promise = global.Promise;
var db = 'mongodb://localhost/logindb';
mongoose.connect(db);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended:true
}));

app.use('/', index);
app.use('/availability',availability);
app.use('/register', register);
app.use('/rfidstatus', rfidstatus);

app.use(express.static(__dirname + '/public'));

app.set('views', path.join(__dirname, 'views'));
// view engine setup
app.engine('html',consolidate.swig)
app.set('view engine', 'html');

//application starts listening.
app.listen(port,function(){
	console.log('app listening on port'+ port);
});

module.exports = app;