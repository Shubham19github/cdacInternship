//written by Shubham  Kumar

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ldetails = require('../login_model');
registered = ldetails[1];

router.get('/', function(req, res) {
  res.render('register');
});

router.post('/success',function(req,res){
	var create_date = Date();		//getting current date and time.

	var swipe_date = create_date;	
	
	var name = req.body.name;
	var tag = req.body.rfid_tag;
	var sub_name = name.substr(0,4);		//taking first four character of employee name.
	var sub_tag = tag.substr(-4,4);			//taking last four characters from RFID ID.
	var esp_id = sub_name.concat(sub_tag);	//forming unique ESP_ID by joining both.
	var availability = "No"; 	

	var data = {
		name : req.body.name,
		rfid_tag : req.body.rfid_tag,
		create_date : create_date,
		swipe_date : swipe_date,
		esp_id : esp_id,
		availability : availability
	}

	registered.create(data,function(err,device){		//creating records on database.
		if(err){
			res.render('error');
		}
		else{
			res.render('success',{user:req.body.name});
		}
	});

	
});


module.exports = router;
