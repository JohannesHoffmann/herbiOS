import MQTT from "mqtt";
import ConfigService from "./ConfigService";
import { SubTopic, Topic } from "./IMqtt";
import SerialService from "./SerialService";

function onConnect (mqttClient: MQTT.MqttClient) {
    const { homeAssistantIntegration, lights } = ConfigService.getInstance().getConfig();
    // Register light to HomeAssistant if enabled
    if (homeAssistantIntegration) {
        for (const light of lights) {
            mqttClient.publish(
                `homeassistant/light/${light.sensorerId}/config`, 
                JSON.stringify({
                    "~": `homeassistant/light/${light.sensorerId}`,
                    "name": light.name,
                    "unique_id": light.sensorerId,
                    "cmd_t": "~/set",
                    "stat_t": "~/state",
                    "schema": "json",
                    "brightness": light.brightness
                  })
            );
        }
    }

    // Register Lights to herbiOs
    for (const light of lights) {
        mqttClient.publish(
            `${Topic.namespace}/${SubTopic.light}/${light.sensorerId}/${Topic.config}`, 
            JSON.stringify({
                "name": light.name,
                "unique_id": light.sensorerId,
                "brightness": light.brightness
              }),
              {
                  retain: true,
              }
        );
    }
}

function subscribe (mqttClient: MQTT.MqttClient) {
    const { homeAssistantIntegration, lights} = ConfigService.getInstance().getConfig();

    for (const light of lights) {

        // create array for topcis if not available
        if (!light.stateTopics) {
            light.stateTopics = [];
        }
        if (!light.setTopics) {
            light.setTopics = [];
        }
        
        // Add herb default topics
        light.stateTopics.push(`${Topic.namespace}/${SubTopic.light}/${light.sensorerId}/${Topic.state}`);
        light.setTopics.push(`${Topic.namespace}/${SubTopic.light}/${light.sensorerId}/${Topic.set}`);

        // add HomeAssistant topics if integration is enabled
        if (homeAssistantIntegration) {
            light.stateTopics.push(`homeassistant/light/${light.sensorerId}/state`);
            light.setTopics.push(`homeassistant/light/${light.sensorerId}/set`);
        }

        // state topics
        mqttClient.subscribe(light.stateTopics, function (err) {
            if (err) {
                console.log(`Error to subscribe ${JSON.stringify(light.stateTopics)}`, err);
            }
        });

        // set topics
        mqttClient.subscribe(light.setTopics, function (err) {
            if (err) {
                console.log(`Error to subscribe ${JSON.stringify(light.setTopics)}`, err);
            }
        });
    }
}


function onMqttMessage (mqttClient: MQTT.MqttClient, topic: string, message: string) {
    const { lights} = ConfigService.getInstance().getConfig();


    for (const light of lights) {
        // only go through set topics
        for (const setTopic of light.setTopics) {
            if (topic === setTopic) {

                const newState: {brightness: number; state: "ON" | "OFF"} = {
                    brightness: 204,
                    ...JSON.parse(message),
                };

                // publish to all channels via MQTT
                for (const stateTopic of light.stateTopics) {
                    mqttClient.publish(
                        stateTopic,
                        JSON.stringify(newState),
                        {
                            retain: true,
                        }
                    );
                }

                // Set light leven via serial to hardware
                if (newState.state === "OFF") {
                    SerialService.sendFastCommand(`setLight -light ${light.sensorerId} -level 0`);
                    continue;
                }
                SerialService.sendFastCommand(`setLight -light ${light.sensorerId} -level ${newState.brightness}`);
            }
        }

    }
}

function onSerialMessage (message: string) {

}


export {
    onConnect,
    subscribe,
    onMqttMessage,
    onSerialMessage,
}