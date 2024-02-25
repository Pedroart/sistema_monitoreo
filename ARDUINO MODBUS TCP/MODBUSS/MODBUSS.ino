/*
  Creditos: Modbus-Arduino
  Archivo Modificados para observar solicitudes
  Modbus IP ENC28J60
  Copyright by André Sarmento Barbosa
  http://github.com/andresarmento/modbus-arduino
*/
#include <Arduino.h>
#include <SPI.h>
#include <EtherCard.h>
#include <Modbus.h>
#include <ModbusIP_ENC28J60.h>
#define TCP_KEEP_ALIVE

/*
  Variables a controlar:
  - Bit Estado        modificable 088
  - Estado            modificable    099 
  - Tiempo de LED      Modificable    100
  - Valor Random       lectura        101
*/

//Modbus Registers Offsets (0-9999)
const int bitestados = 88;
const int estados = 99;
const int tiempoled = 100;
const int valorrandom = 101;

const int ledPin = 13; // Pin del LED integrado en el Arduino Uno
int ledState = LOW; // Estado actual del LED (inicialmente apagado)
unsigned long previousMillis = 0; // Tiempo del último cambio de estado del LED
long interval = 1000; // Intervalo de parpadeo del LED en milisegundos

//ModbusIP object
ModbusIP mb;

long ts;

void setup() {
    // The media access control (ethernet hardware) address for the shield
    byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
    // The IP address for the shield
    byte ip[] = { 192, 168, 1, 120 };
    byte gwip[] = { 192,168,1,1 };

    //Config Modbus IP
    mb.config(mac, ip);

    // Add SENSOR_IREG register - Use addIreg() for analog Inputs
    pinMode(ledPin, OUTPUT);
    Serial.begin(9600);
    Serial.println("Inicio");
    Serial.println("Registro");
    
    mb.addIsts(bitestados,0);
    mb.addHreg(estados,0);
    mb.addHreg(tiempoled,interval);
    mb.addIreg(valorrandom,0);

    ts = millis();
}

void loop() {
  //Call once inside loop() - all magic here
  mb.task();

  // Generar valor aleatorio
  int randomValue = random(1024);
  mb.Ireg(valorrandom,randomValue);

  interval = mb.Hreg(tiempoled);

  mb.Ists(bitestados,ledState);
  
  unsigned long currentMillis = millis();
  // Verificar si ha pasado el tiempo necesario para cambiar el estado del LED
  if (currentMillis - previousMillis >= interval) {
    // Serial.print(interval);
    // Guardar el último tiempo de cambio de estado
    previousMillis = currentMillis;

    // Cambiar el estado del LED
    if (ledState == LOW) {
      ledState = HIGH;
    } else {
      ledState = LOW;
    }

    // Aplicar el nuevo estado al LED
    digitalWrite(ledPin, ledState);
  }
}
