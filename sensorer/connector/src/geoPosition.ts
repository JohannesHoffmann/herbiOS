import MQTT from "mqtt";
import ConfigService from "./ConfigService";
import { SubTopic, Topic } from "./IMqtt";
import SerialService, { SerialStuff } from "./SerialService";

interface IGeo {
    status: number,
    dateTime: Date,
    lat: number,
    lon: number,
    headingDeviation: string,
    speed: number,
    altitude: number,
    satellites: number,
}

function onConnect (mqttClient: MQTT.MqttClient) {
    const { geoPosition } = ConfigService.getInstance().getConfig();

    // create array for topcis if not available
    if (!geoPosition.state_topics) {
        geoPosition.state_topics = [];
    }
    
    // Add herbi default topics
    geoPosition.state_topics.push(`${Topic.namespace}/${SubTopic.geoPosition}/${Topic.state}`);
}

function subscribe (mqttClient: MQTT.MqttClient) {
   
}


function onMqttMessage (mqttClient: MQTT.MqttClient, topic: string, message: string) {
    
}

function onSerialMessage (message: string, mqttClient: MQTT.MqttClient) {
    const [type, value] = message.toString().split(SerialStuff.delimiter);
    const { geoPosition } = ConfigService.getInstance().getConfig();

    if (type === "geoPosition") {
        const dataArray = value.split(",");
        if (dataArray.length >= 4 && Number(dataArray[2]) < 10000000 && Number(dataArray[3]) < 10000000) {
            return;
        }
        const [status, dateTime, lat, lon, headingDeviation, speed, altitude, satellites] = dataArray;
        const newGeo = {
            status: Number(status),
            dateTime: new Date(dateTime),
            lat: Number(lat) / 10000000,
            lon: Number(lon) / 10000000,
            headingDeviation,
            speed: Number(speed),
            altitude: Number(altitude),
            satellites: Number(satellites),
        };

        if (!lat|| !lon) {
            console.log("Geo not ok", newGeo);
            return;
        }

        console.log("Geo ok", newGeo);

        for (const stateTopic of geoPosition.state_topics) {
            mqttClient.publish(
                stateTopic,
                JSON.stringify(newGeo),
                {
                    retain: true,
                }
            );
        }
        
    }
}


export {
    onConnect,
    subscribe,
    onMqttMessage,
    onSerialMessage,
}