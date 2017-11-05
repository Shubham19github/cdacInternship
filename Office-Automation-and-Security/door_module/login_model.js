//written by Shubham  Kumar
//This file describes Schema for two models used in the project.

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//For Admin
var LoginSchema = new Schema({
	username : String,
	password: String
});

//For Employee
var RegisterSchema = new Schema({
	name : String,
	rfid_tag : String,
	create_date : String,
	swipe_date : String,
	esp_id : String,
	availability : String
});

rmodel = mongoose.model('registered',RegisterSchema);

lmodel = mongoose.model('logindetails',LoginSchema);

//exporting both
array = [lmodel,rmodel];
module.exports = array;
