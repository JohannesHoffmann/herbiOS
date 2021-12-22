import MQTT from "mqtt";
import ConfigService from "./ConfigService";
import { SubTopic, Topic } from "./IMqtt";
import SerialService, { SerialStuff } from "./SerialService";


function onConnect (mqttClient: MQTT.MqttClient) {
    const { homeAssistantIntegration, sensors } = ConfigService.getInstance().getConfig();
    
    // Register sensors to HomeAssistant if enabled
    if (homeAssistantIntegration) {
        for (const sensor of sensors) {
            let icon;

            switch (sensor.icon) {
                case "thermometer":
                    icon = "mdi:thermometer";
                    break;
                case "battery":
                    icon = "mdi:battery-80";
                    break;
            }

            mqttClient.publish(
                `homeassistant/sensor/${sensor.sensorerId}/config`, 
                JSON.stringify({
                    "~": `homeassistant/sensor/${sensor.sensorerId}`,
                    "name": sensor.name,
                    "unique_id": sensor.sensorerId,
                    "stat_t": "~/state",
                    "unit_of_measurement": sensor.unit_of_measurement,
                    "icon": icon
                  })
            );
        }
    }

    // Register sensors to herbiOs
    for (const sensor of sensors) {
        mqttClient.publish(
            `${Topic.namespace}/${SubTopic.sensor}/${sensor.sensorerId}/${Topic.config}`, 
            JSON.stringify({
                "name": sensor.name,
                "unique_id": sensor.sensorerId,
                "unit_of_measurement": sensor.unit_of_measurement,
                "icon": sensor.icon,
              }),
              {
                  retain: true,
              }
        );
    }
}

function subscribe (mqttClient: MQTT.MqttClient) {
    const { homeAssistantIntegration, sensors} = ConfigService.getInstance().getConfig();

    for (const sw of sensors) {

        // create array for topcis if not available
        if (!sw.stateTopics) {
            sw.stateTopics = [];
        }
        
        // Add herb default topics
        sw.stateTopics.push(`${Topic.namespace}/${SubTopic.sensor}/${sw.sensorerId}/${Topic.state}`);

        // add HomeAssistant topics if integration is enabled
        if (homeAssistantIntegration) {
            sw.stateTopics.push(`homeassistant/sensor/${sw.sensorerId}/state`);
        }

        // state topics
        mqttClient.subscribe(sw.stateTopics, function (err) {
            if (err) {
                console.log(`Error to subscribe ${JSON.stringify(sw.stateTopics)}`, err);
            }
        });
    }
}


function onMqttMessage (mqttClient: MQTT.MqttClient, topic: string, message: string) {
    
}

function onSerialMessage (message: string, mqttClient: MQTT.MqttClient) {
    const { sensors } = ConfigService.getInstance().getConfig();
    const [type, sensor] = message.toString().split(SerialStuff.delimiter);
    
    if (type === "sensor" && sensor) {
        const [sensorId, value] = sensor.split(",");
        for (const sensor of sensors) {
            if (sensor.sensorerId === sensorId) {
                for (const stateTopic of sensor.stateTopics) {
                    mqttClient.publish(
                        stateTopic,
                        value,
                        {
                            retain: true,
                        }
                    );
                }
            }
        }
    }
}

export {
    onConnect,
    subscribe,
    onMqttMessage,
    onSerialMessage,
}