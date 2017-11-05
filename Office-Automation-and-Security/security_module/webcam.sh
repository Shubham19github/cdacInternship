#!/bin/bash

#takes current date and time and use it on file name of image.
NOW=$(date +"%d-%m-%Y_%H:%M:%S")

sudo fswebcam -f 1280x720 /home/pi/webcam/$NOW.jpg

