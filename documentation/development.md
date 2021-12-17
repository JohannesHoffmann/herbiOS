# Setup Development

There are several things to do to get the development environment running.

This guide assume that you installed nodejs, npm already.

## Installing Third-Party Services

To work properly we need:

- MQTT Broker (Mosquitto recommended)
- Tileserver (Tileserver-gl recommended)
- Optional: HomeAssistant

### Install via docker-compose

The fast-forward way is to start this dependencies via the docker-compose.yml file in **docker/herbiOS-development**. This will create a Mosquitto Broker , a HomeAssistant and a tileserver instance. The mosquitto example configuration sits next to the docker-compose file.

```bash
docker-compose up -d
```

This command creates some folders inside **docker/herbiOS-development**. The most folders will be filled from the application with persistent data.

To get the offline tiles working copy your downloaded **.mbtiles** file to **tileserver-data** then restart this container with `docker-compose tileserver restart` to load the changes.

If all three containers are up you can then go to the next step (skip the manual installation)

### installing manual

To install the three services manual follow the instructions of the respective application

- [Install Mosquitto MQTT Broker](https://mosquitto.org/download/)
- [Install Tileserver-gl](https://github.com/maptiler/tileserver-gl)
- [Install HomeAssistant](https://www.home-assistant.io/installation/)

## Install herbiOs Parts

At the moment we need two parts to make the system run.

### install the api

```bash
cd ./api
npm install
sudo npm install -g nodemon
sudo npm install -g ts-node
npm start
```

### install the ui

```bash
cd ./ui
npm install
npm start
```

A browser window should open with the ip: [http://localhost:3000](http://localhost:3000)

When a password prompt appears use the default password to get authentication: **hMA3x994QvC46YZKnlBnnhZy4QAsQJus**


## Configure herbiOs

### General configuraiton

The API creates a **config.json** file with all default values under **api/data/config.json**.

### Lights configuration

HerbiOS has its own namespace where the lights controller is listening on. The Topics for set and state are:

**herbiOs/lights/{{unique_id}}/set**
**herbiOs/lights/{{unique_id}}/status**

There is no behavior implemented to move the set value to the state value. This should be managed by yourself or you can use the sensor-connector.

The Data-Schema of the value is

```
{
    "state": "ON" | "OFF",
    "brightness": number
}
```

Data-Schema of the configuration
```ts
{
    "name": string, // Human readable name of the light
    "unique_id": string, // machine readable name ot the light
    "brightness": boolean, // light supports brightness or not. Default is true
    "command_topic"?: string // OPTIONAL custom topic path to set the values
    "state_topic"?: string // OPTIONAL custom topic path of the state
}
```

#### Manual

Edit the **api/data/config.json** file to add lights manually. Add the following part to the json file for a single light:

```json
"lights": [
    {
        "name": "Light name",
        "unique_id": "light1",
        "brightness": true,
    }
]
```

Reload the api by stop the current process and run `npm start` again. A Light should appear on the frontend. The MQTT listens to **herbiOs/lights/light1/set** and **herbiOs/lights/light1/status**

#### Auto-Discovery

You can also send the configuration of a light directly via MQTT via a tool of your choice. Send the below JSON to the topic **herbiOs/lights/kitchen/config**. Set the retained flat to true to get the config on ui reload instantly.

Data structure of the configuration:
```json
{
    "name": "Kitchen",
    "unique_id": "kitchen",
    "brightness": true
}
```

No reload is required. The new light should appear in the control of the frontend. Remember to also provide the behavior of putting ~/set changes to ~/state changes.

## Sensor Connector

This is a small piece of software that handles the MQTT changes of a **~/set** topic to write it into a **~/state** topic. Also it sends the changed value via serial communication to the sensorer arduino board. On development environment the serial communication leads to a console output instead of a real communication.

### installing

```bash
cd ./sensorer/connector
npm install
npm start
```

### configure

The first start of the software via `npm start`creates a config.json file under **./sensorer/connector/config.json**.
This file includes also a **lights** property to setup the available lights.

Add this to the configuration:
```json
"lights": [
    {
        "name": "Light name",
        "unique_id": "light1",
        "brightness": true
    }
]
```

Restart the application to load the changes

All configured lights will be registered to the herbiOs API via the MQTT auto discovery. By default it also adds configuration to HomeAssistant topics. HomeAssistant will then auto discover the configured lights. To prevent this set `"homeAssistantIntegration": false` in the config.json.

### features

The sensorer/connector listens on the herbiOs and homeAssistant MQTT Topics for **~/set**, creates a serial command and publish the new value to **~/state**.

