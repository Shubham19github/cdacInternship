//written by Shubham  Kumar
//Here instead of external LED, i have used Builtin LED of ESP Module.
//Change according to your availability.

#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// Update these with values suitable for your network.

const char* ssid = "cdac";
const char* password = "";
const char* mqtt_server = "10.208.42.166";  // ip address of MQTT server

WiFiClient espClient;
PubSubClient client(espClient);
char msg[50];
int value = 0;
int mesg = 0;
int _value = 0;
int inputPin = 12;    //PIR sensor attached to GPIO pin 12 of ESP Module
int matched = 0;
String espid = "Shub1361";    //Change ESP ID accordingly

void setup() {
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
  pinMode(BUILTIN_LED, OUTPUT);
  pinMode(inputPin, INPUT);     
  Serial.begin(115200);
}
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  for (int i = 1; i < length; i++) {        //matching ESP ID.
    if ((char)payload[i] == espid[i-1]){
        matched = 1;
      }else {
          matched = 0;
        }
  }
  if (matched == 1) {
        if ((char)payload[0] == '1'){       //checking first bit of message to start or stop PIR sensor.
          mesg = 1;
        } else if ((char)payload[0] == '0'){
          mesg = 0;
        }
  }
   
}

void setup_wifi() {

  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("ESP8266Client")) {
      Serial.println("connected");
      client.subscribe("AUTH_EMP");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void loop() {

  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  if(mesg == 1)
  {
        _value = digitalRead(inputPin);       //reading value from PIR sensor
    if(_value == 1){

        //checking for 8 seconds if continuously HIGH is read, turning ON the LED.
        int i=0;
          for(i=0;i<2;i++){
              if(digitalRead(12) == 0){
                  break;
                }
              else{
                  delay(4000);
                  if(i==1){
                    Serial.println("LED ON");
                    digitalWrite(BUILTIN_LED, LOW);
                    client.publish("EMP_AVAILABILITY", "1Shub1361" );     //Publishing message indicating 1 as YES representing availability of Employee.
                  }
                }
            }
        
      
      }else {

        //checking for 20 seconds if continuously LOW is read, turning OFF the LED.
          int i=0;
          for(i=0;i<5;i++){
              if(digitalRead(12) == 1){
                  break;
                }
              else{
                  delay(4000);
                  if(i==4){
                    Serial.println("LED OFF");
                    digitalWrite(BUILTIN_LED, HIGH);
                    client.publish("EMP_AVAILABILITY", "0Shub1361" );       //Publishing message indicating 0 as NO representing non-availability of Employee.
                  }
                }
            }
        
         }    
  }
  else if(mesg == 0){
      digitalWrite(BUILTIN_LED, HIGH);
    }

 
}
