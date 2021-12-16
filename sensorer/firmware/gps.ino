#if useGps
#include <NMEAGPS.h>
#include <GPSport.h> // Settings of the used Serial Port are here

//------------------------------------------------------------
// For the NeoGPS example programs, "Streamers" is common set
//   of printing and formatting routines for GPS data, in a
//   Comma-Separated Values text format (aka CSV).  The CSV
//   data will be printed to the "debug output device".
// If you don't need these formatters, simply delete this section.

#include <Streamers.h>

//------------------------------------------------------------
// This object parses received characters
//   into the gps.fix() data structure

static NMEAGPS  gps;

//------------------------------------------------------------
//  Define a set of GPS fix information.  It will
//  hold on to the various pieces as they are received from
//  an RMC sentence.  It can be used anywhere in your sketch.

static gps_fix  fix;

//----------------------------------------------------------------
//  This function gets called about once per second, during the GPS
//  quiet time.  It's the best place to do anything that might take
//  a while: print a bunch of things, write to SD, send an SMS, etc.
//
//  By doing the "hard" work during the quiet time, the CPU can get back to
//  reading the GPS chars as they come in, so that no chars are lost.


Command gpsCommand;


static void GPSloop()
{
  while (gps.available( gpsPort )) {
    fix = gps.read();
  }
} 

static void GPSsetup() {
  
  gpsPort.begin(9600);
  gpsCommand = cli.addCommand("getPosition", gpsCallback);

  #if debug
    Serial.println("GPS enabled");
  #endif
}


void gpsCallback(cmd* c) {
    Command cmd(c); // Create wrapper object

    trace_all(Serial, gps, fix );
}
#endif