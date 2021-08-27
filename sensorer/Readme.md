# Sensorer

This is an Arduino firmware that works as a proxy to all connected devices. It can:

* dim lights
* manage the heater (Autoterm 2D)
* GPS
* Switches (PowerPlugs, Chiller, Inverter)
* Fans

## Development

Open this folder with the Arduino Editor. This Sketch is for the Arduino MEGA.

## Compiling

To Compile the sketch uses the following libraries

* [SimpleCLI](https://github.com/spacehuhn/SimpleCLI/)
* [NeoGPS](https://github.com/SlashDevin/NeoGPS)
* [Crc16](https://github.com/vinmenn/Crc16)
* SoftwareSerial

Tested and compiled with Arduino 1.8.13