/******************************************************************************
 *  Archivo   : dht11_firebase.ino
 *  Propósito : Publicar lecturas del DHT11 y controlar un relé vía nube
 *  Autor     : [Casillas Sánchez Ramón D. & García Gámez Marco A.]
 *  Versión   : 1.0
 ******************************************************************************/

 #include "Particle.h"
 #include "Adafruit_DHT.h"      // Library ID: adafruit/Adafruit_DHT
 #include "Adafruit_Sensor.h"   // Dependency
 
 #define DHTPIN   D2
 #define DHTTYPE  DHT11
 #define RELAYPIN D7
 #define PERIOD   10000UL        // 10 s
 
 DHT dht(DHTPIN, DHTTYPE);
 unsigned long lastPublish = 0;
 
 int relayControl(String command);
 
 void setup() {
     pinMode(RELAYPIN, OUTPUT);
     digitalWrite(RELAYPIN, LOW);
     dht.begin();
     Particle.function("relay", relayControl);
     Serial.begin(9600);
 }
 
 void loop() {
     if (millis() - lastPublish >= PERIOD) {
         float humidity    = dht.readHumidity();
         float temperature = dht.readTemperature(); // °C
 
         if (isnan(humidity) || isnan(temperature)) {
             Serial.println("Error al leer DHT11");
             return;
         }
 
         char payload[64];
         snprintf(payload, sizeof(payload),
                  "{\"t\":%.2f,\"h\":%.2f}", temperature, humidity);
         Particle.publish("envReading", payload, PRIVATE);
         Serial.printlnf("Publicado → %s", payload);
         lastPublish = millis();
     }
 }
 
 int relayControl(String command) {
     command.toLowerCase();
     if (command == "on")  { digitalWrite(RELAYPIN, HIGH); return 1; }
     if (command == "off") { digitalWrite(RELAYPIN, LOW);  return 0; }
     return -1;
 }
 