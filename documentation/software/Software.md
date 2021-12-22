# Parts of the Software

This software is split into different parts with different purposes:

## Installing

There is only the setup of the development environment documented. [Use this guide to install herbiOs](../development.md).

## Configuring

Once the system is running you can add the following Entities:

- [Add Lights](configure/Lights)
- [Add Heaters](configure/Climate)
- [Add Fans](configure/Fans)
- [Add Switches](configure/Switches)
- [Provide Geo Location](configure/GeoPosition)

## Parts of the Software

### API

The api is the core and the backend of herbiOS. It contains all the smartness and knows how to communicate with the each element of the van.

[Go to the API Section](../api/README.md)

### UI

The interface you can see on your screen or smartphone enables you to interact with all components.

[Go to the UI Section](../ui/README.md)

### Groundcontrol

A small server that running 24/7 somewhere. The api is sending telemetry or receives commands from ground control. If you are not at the van the ui requests the data from ground control.

[Go to the Ground Control Section](../groundcontrol/README.md)

### Tileserver

You do not have reception everywhere where you park your van but you always wants the ability to plan your trip. This is why the herbiOS has its own tileserver.

[Go to the Tileserver Section](Offline%20Maps.md)