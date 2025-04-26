/******************************************************************************
 *  Archivo   : dht11_firebase.ino
 *  Propósito : Publicar lecturas del DHT11 y controlar un relé vía nube
 *  Autor     : [Tu nombre]
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
 
