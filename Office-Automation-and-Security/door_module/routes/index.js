//written by Shubham  Kumar

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ldetails = require('../login_model');

logindetails = ldetails[0];

router.get('/', function(req, res) {
  res.render('index');
});

router.post('/register',function(req,res){
	var password = req.body.password;
	logindetails.findOne({username:req.body.username},function(err,login){		//finding admin name in database
		if(err){
			res.render('error');
		}
		else{
			if((login.password)==password){										//matching password stored on database
				res.render('register',{adminname:req.body.username});
			}
			else{
				res.render('error');
			}
		}
	});
});


module.exports = router;