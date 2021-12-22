import MQTT from "mqtt";
import ConfigService from "./ConfigService";
import * as Lights from "./lights";
import * as Switches from "./switches";
import * as Fans from "./fans";
import * as Climates from "./climates";
import * as GeoPosition from "./geoPosition";
import * as Sensors from "./sensors";
import SerialService from "./SerialService";

const config = ConfigService.getInstance();

const start = async () => {
    var client  = MQTT.connect('mqtt://localhost:1883');


    client.on('message', function (topic, message) {
        Lights.onMqttMessage(client, topic, message.toString());
        Switches.onMqttMessage(client, topic, message.toString());
        Fans.onMqttMessage(client, topic, message.toString());
        Climates.onMqttMessage(client, topic, message.toString());
        Sensors.onMqttMessage(client, topic, message.toString());
        // client.end()
    });

    client.on('connect', function () {
        Lights.onConnect(client);
        Switches.onConnect(client);
        Fans.onConnect(client);
        Climates.onConnect(client);
        GeoPosition.onConnect(client);
        Sensors.onConnect(client);

        Lights.subscribe(client);
        Switches.subscribe(client);
        Fans.subscribe(client);
        Climates.subscribe(client);
        GeoPosition.subscribe(client);
        Sensors.subscribe(client);
    });

    // Register listeners for Serial Port
    SerialService.getInstance().onMessage((message) => {
        Lights.onSerialMessage(message);
        Switches.onSerialMessage(message);
        Fans.onSerialMessage(message);
        Climates.onSerialMessage(message, client);
        GeoPosition.onSerialMessage(message, client);
        Sensors.onSerialMessage(message, client);
    })
}

start();