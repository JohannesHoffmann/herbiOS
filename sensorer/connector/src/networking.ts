import MQTT from "mqtt";
import ConfigService from "./ConfigService";
import { SubTopic, Topic } from "./IMqtt";
import SerialService from "./SerialService";
import {exec} from "child_process";

enum NetworkingTopics {
    interface = "interface",
    modem = "modem"
}

function onConnect (mqttClient: MQTT.MqttClient) {
    const { homeAssistantIntegration, networking } = ConfigService.getInstance().getConfig();
    const { interfaces, modems} = networking;

    // Register interfaces to HomeAssistant if enabled
    if (homeAssistantIntegration) {
        for (const inf of interfaces) {
            // Add a Button to switch interface on/off
            mqttClient.publish(
                `homeassistant/switch/${NetworkingTopics.interface}${inf.interfaceName}/config`, 
                JSON.stringify({
                    "~": `homeassistant/switch/${NetworkingTopics.interface}${inf.interfaceName}`,
                    "name": inf.name,
                    "unique_id": `${NetworkingTopics.interface}${inf.interfaceName}`,
                    "cmd_t": "~/set",
                    "stat_t": "~/state",
                    "schema": "json",
                    "icon": "mdi:signal-variant"
                  })
            );

            // Add a sensor for signal strength
            mqttClient.publish(
                `homeassistant/sensor/${NetworkingTopics.interface}${inf.interfaceName}/config`, 
                JSON.stringify({
                    "~": `homeassistant/sensor/${NetworkingTopics.interface}${inf.interfaceName}`,
                    "name": `${inf.name} Signal strength`,
                    "unique_id": `${NetworkingTopics.interface}${inf.interfaceName}`,
                    "stat_t": "~/state",
                    "icon": "mdi:signal-variant"
                  })
            );
        }
    }

    // Register Interfaces to herbiOs
    for (const inf of interfaces) {
        mqttClient.publish(
            `${Topic.namespace}/${SubTopic.networking}/${NetworkingTopics.interface}/${inf.interfaceName}/${Topic.config}`, 
            JSON.stringify({
                name: inf.name,
                unique_id: inf.interfaceName,
              }),
              {
                  retain: true,
              }
        );
    }
}

function subscribe (mqttClient: MQTT.MqttClient) {
    const { homeAssistantIntegration, networking} = ConfigService.getInstance().getConfig();
    const { interfaces, modems} = networking;

    for (const inf of interfaces) {

        // create array for topcis if not available
        if (!inf.stateTopics) {
            inf.stateTopics = [];
        }
        if (!inf.setTopics) {
            inf.setTopics = [];
        }
        if (!inf.signal_strength_state_topic) {
            inf.signal_strength_state_topic = [];
        }
        
        // Add herbi default topics
        inf.stateTopics.push(`${Topic.namespace}/${SubTopic.networking}/${NetworkingTopics.interface}/${inf.interfaceName}/${Topic.state}`);
        inf.setTopics.push(`${Topic.namespace}/${SubTopic.networking}/${NetworkingTopics.interface}/${inf.interfaceName}/${Topic.set}`);
        inf.signal_strength_state_topic.push(`${Topic.namespace}/${SubTopic.networking}/${NetworkingTopics.interface}/${inf.interfaceName}/signal_strength`);

        // add HomeAssistant topics if integration is enabled
        if (homeAssistantIntegration) {
            inf.stateTopics.push(`homeassistant/switch/${NetworkingTopics.interface}${inf.interfaceName}/state`);
            inf.setTopics.push(`homeassistant/switch/${NetworkingTopics.interface}${inf.interfaceName}/set`);
            inf.signal_strength_state_topic.push(`homeassistant/sensor/${NetworkingTopics.interface}${inf.interfaceName}/state`);
        }

        // state topics
        mqttClient.subscribe(inf.stateTopics, function (err) {
            if (err) {
                console.log(`Error to subscribe ${JSON.stringify(inf.stateTopics)}`, err);
            }
        });

        // set topics
        mqttClient.subscribe(inf.setTopics, function (err) {
            if (err) {
                console.log(`Error to subscribe ${JSON.stringify(inf.setTopics)}`, err);
            }
        });
        
    }
}


function onMqttMessage (mqttClient: MQTT.MqttClient, topic: string, message: string) {
    const { networking } = ConfigService.getInstance().getConfig();
    const { interfaces, modems} = networking;

    for (const inf of interfaces) {
        // Check main command topic
        for (const setTopic of inf.setTopics) {
            if (topic === setTopic) {
                const newState = message as "ON" | "OFF";

                const command = newState === "ON" ? "up" : "down";

                exec(`sudo ifconfig ${inf.interfaceName} ${command}`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        return;
                    }
                    console.log(`Interface ${inf.interfaceName} is ${newState}`, stdout);
                });

                // publish to all channels via MQTT
                for (const stateTopic of inf.stateTopics) {
                    mqttClient.publish(
                        stateTopic,
                        newState,
                        {
                            retain: true,
                        }
                    );
                }
            }
        }

        for (const stateTopic of inf.signal_strength_state_topic) {
            mqttClient.publish(
                stateTopic,
                "5",
                {
                    retain: true,
                }
            );

        }
    }
}

function onSerialMessage (message: string, mqttClient: MQTT.MqttClient) {

}


export {
    onConnect,
    subscribe,
    onMqttMessage,
    onSerialMessage,
}