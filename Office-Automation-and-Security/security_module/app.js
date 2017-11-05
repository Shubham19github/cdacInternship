//written by Shubham  Kumar
//Security Module
//Read readme.txt for running this application.
//This file contains code for PIR sensor, buzzer and calling function of file exec_process.js to run the camera.
//It stores images in path specified and then route it to path '/'.

var express=require('express');
var app = express();
var port = 6500;
var execProcess = require("./exec_process.js");
var bodyParser = require('body-parser');

//For displaying gallery of images captured
var Gallery = require('express-photo-gallery');
var options={
	title : 'Images Captured'
};
app.use('/',Gallery('/home/pi/webcam',options));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended:true
}));

//application starts listening on specified port no.
app.listen(port,function(){
	console.log('app listening on port'+ port);
});

//for PIR sensor
var gpio = require('onoff').Gpio,
pir = new gpio(17, 'in', 'both');

var reading = 0;

//function for beeping buzzer
function buzzer(){
		var buz = new gpio(16, 'out');
		buz.writeSync(1);		//beeping buzzer for 5 seconds.
		setTimeout(function(){
			buz.writeSync(0);
			buz.unexport();
		}, 5000);
}


//continuously runs PIR sensor and if intruder arrives, it calls buzzer and camera function.
pir.watch(function(err, value){
    if(err){ pir.unexport(); }

    reading =  value;
	if(reading==1)
	{
		buzzer();
		execProcess.result("sh ./webcam.sh");		//executes command written on webcam.sh file.	
	}
	
});

module.exports = app;