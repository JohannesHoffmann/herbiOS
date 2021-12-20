import MQTT from "mqtt";
import ConfigService from "./ConfigService";
import * as Lights from "./lights";
import * as Switches from "./switches";
import * as Fans from "./fans";
import SerialService from "./SerialService";

const config = ConfigService.getInstance();

const start = async () => {
    var client  = MQTT.connect('mqtt://localhost:1883');


    client.on('message', function (topic, message) {
        Lights.onMqttMessage(client, topic, message.toString());
        Switches.onMqttMessage(client, topic, message.toString());
        Fans.onMqttMessage(client, topic, message.toString());
        // client.end()
    });

    client.on('connect', function () {
        Lights.onConnect(client);
        Switches.onConnect(client);
        Fans.onConnect(client);

        Lights.subscribe(client);
        Switches.subscribe(client);
        Fans.subscribe(client);
    });

    // Register listeners for Serial Port
    SerialService.onMessage((message) => {
        Lights.onSerialMessage(message);
        Switches.onSerialMessage(message);
    })
}

start();