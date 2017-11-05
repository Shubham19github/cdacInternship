//written by Shubham  Kumar

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ldetails = require('../login_model');

registered = ldetails[1];

router.get('/',function(req,res){
	registered.find({}).exec(function(err,datas){
		if(err){
			res.render('error');
		}
		else{
			res.render('rfidstatus',{data:datas});
		}
	});
});


module.exports = router;
