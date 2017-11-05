Office Automation and Security.
This Project  is based on Automation and Internet of Things.
Please read report of the project to know about Hardware and Software requirements. 

This Project is divided into three modules:
1) Door Module
2) Indoor Module
3) Security Module

Find the respective folders and follow these to run the application.

1) Door Module:
	a) Copy all the contents of Door Module into one of the Raspberry Pi.
	b) Open terminal and go to folder of Door Module and run command - "npm install".
	c) Open app.js change address of mongoDB server.
	d) Open rfid.js change these values accordingly: address of MQTT server and ESP_ID
	e) Open views folder, in html files update the ip address of raspberry pi running in Security Module to access the images.
	d) Run command - "sudo node rfid.js".

2) Indoor Module
	a) Open file indoor_module in Arduino IDE and go throgh comments to update certain values according to your need like network details,
	   ip address of MQTT, ESP_ID and Pin numbers.
	b) Click on Verify and then upload to ensure no errors are present and flash this code into ESP Module.

3) Security Module
	a) Copy all the contents of Security Module into another Raspberry Pi.
	b) Open terminal and go to folder of Security Module and run command - npm install
	c) Open file app.js and go through comments, change path of folder where you want to store images.
	d) Run command - "sudo node app.js".