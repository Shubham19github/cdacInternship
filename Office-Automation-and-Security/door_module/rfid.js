//written by Shubham  Kumar
//Read readme.txt for running this application.
//This file has codes for connecting to MQTT server, functions for updating database and for all the functioning of hardwares like buzzer, motor, RFID reader.

var express = require('express');
var router = express.Router();
var SerialPort = require('serialport');
var mongoose = require('mongoose');
var ldetails = require('./login_model');
var app = require('./app');

//using RegisterSchema
registered = ldetails[1];

//for buzzer
var gpio = require('onoff').Gpio;

//for motor
var Gpio = require('pigpio').Gpio,
motor = new Gpio(26, {mode : Gpio.OUTPUT}),

//for smoothly rotating motor
pulseWidth = 1000,
increment = 50;

var esp_id;

//connecting to MQTT Server
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://10.208.42.166:1883');			//change with IP address of MQTT server
var msg_recvd;

//subscribing to topic 
client.on('connect',function(){
	client.subscribe('EMP_AVAILABILITY');
});

//splitting message and checking availability of Employee and their ESPID
client.on('message',function(topic, message){
	msg_recvd = message.toString();
	var id = msg_recvd.substr(1,9);
	if(msg_recvd.substr(0,1) == "0"){
		yorn = "No"
	}else if(msg_recvd.substr(0,1) == "1"){
		yorn = "Yes"
	}
	led_update(id,yorn);
});

//updating Employee Availability in database
function led_update(id,yorn){
	registered.update({esp_id:id},{
		$set:{availability:yorn}},
		{upsert:true},
		function(err,data){
			if(err){
				console.log('error');
			}
			else{
				console.log(id+yorn+' Employee availability updated');
			}
		});
}

//function to beep buzzer for 2 seconds.
function buzzer(){
		var buz = new gpio(16, 'out');
		buz.writeSync(1);
		setTimeout(function(){
			buz.writeSync(0);
			buz.unexport();
		}, 2000);
}

//rotating motor to open door
function open_door(){
	myvar = setInterval(function(){
		motor.servoWrite(pulseWidth);
		pulseWidth += increment;
		
		if(pulseWidth == 2100)
		{
			clearInterval(myvar);	
		}
	
		if(pulseWidth <= 900){
			increment = 50;
		}

	},100);

}

//rotating motor to close door
function close_door(){
	myvar = setInterval(function(){
		motor.servoWrite(pulseWidth);
		pulseWidth += increment;
		
		if(pulseWidth == 900)
		{
			clearInterval(myvar);	
		}
	
		if(pulseWidth >= 2100){
			increment = -50;
		}
		
	},100);


}

//Publishing message so that ESP ID starts running
function mes_publish(esp_id){
	var id = esp_id;
	var signal = "1";
	var command = signal.concat(id);
	
	client.publish('AUTH_EMP', command);
}

//for RFID reader
var port = new SerialPort("/dev/ttyS0",{
  parser: SerialPort.parsers.byteLength(12),
  lock: false
});

//updating database on every swipe
port.on("open",function(){

  port.on('data', function(data){
		var tag = data.toString();	
		var swipe_date = Date();		//getting current date.
		dbFunction(tag,swipe_date);
	});

});

//function to update Database
function dbFunction(tag,swipe_date){

	registered.findOne({rfid_tag:tag},function(err,data){
		
		if(data == null ){
			//if Tag swiped is not authorised
			buzzer();		//beep buzzer
		}
		else{
			esp_id = data.esp_id;
			registered.update({rfid_tag:tag},{
			$set:{swipe_date:swipe_date}},
			{upsert:true},
			function(err,data){
				if(err){
					console.log('error');
				}
				else{		//update database and open door
					open_door();
					setTimeout(close_door, 10000);		//waiting for 10 seconds before door closes again.
					mes_publish(esp_id);			//Publishing message
				}
			});			
		}
		
	});
}