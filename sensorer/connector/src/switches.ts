import MQTT from "mqtt";
import ConfigService from "./ConfigService";
import { SubTopic, Topic } from "./IMqtt";
import SerialService from "./SerialService";

export enum SwitchTopic {
    namespace = "switches",
    prefix = "switch"
}

function onConnect (mqttClient: MQTT.MqttClient) {
    const { homeAssistantIntegration, switches } = ConfigService.getInstance().getConfig();
    
    // Register switches to HomeAssistant if enabled
    if (homeAssistantIntegration) {
        for (const sw of switches) {
            mqttClient.publish(
                `homeassistant/switch/${SwitchTopic.prefix}${sw.sensorerId}/config`, 
                JSON.stringify({
                    "~": `homeassistant/switch/${SwitchTopic.prefix}${sw.sensorerId}`,
                    "name": sw.name,
                    "unique_id": SwitchTopic.prefix + sw.sensorerId,
                    "cmd_t": "~/set",
                    "stat_t": "~/state",
                    "schema": "json",
                  })
            );
        }
    }

    // Register switches to herbiOs
    for (const sw of switches) {
        mqttClient.publish(
            `${Topic.namespace}/${SwitchTopic.namespace}/${SwitchTopic.prefix}${sw.sensorerId}/${Topic.config}`, 
            JSON.stringify({
                "name": sw.name,
                "unique_id": SwitchTopic.prefix + sw.sensorerId,
              }),
              {
                  retain: true,
              }
        );
    }
}

function subscribe (mqttClient: MQTT.MqttClient) {
    const { homeAssistantIntegration, switches} = ConfigService.getInstance().getConfig();

    for (const sw of switches) {

        // create array for topcis if not available
        if (!sw.stateTopics) {
            sw.stateTopics = [];
        }
        if (!sw.setTopics) {
            sw.setTopics = [];
        }
        
        // Add herb default topics
        sw.stateTopics.push(`${Topic.namespace}/${SubTopic.switch}/${SwitchTopic.prefix}${sw.sensorerId}/${Topic.state}`);
        sw.setTopics.push(`${Topic.namespace}/${SubTopic.switch}/${SwitchTopic.prefix}${sw.sensorerId}/${Topic.set}`);

        // add HomeAssistant topics if integration is enabled
        if (homeAssistantIntegration) {
            sw.stateTopics.push(`homeassistant/switch/${SwitchTopic.prefix}${sw.sensorerId}/state`);
            sw.setTopics.push(`homeassistant/switch/${SwitchTopic.prefix}${sw.sensorerId}/set`);
        }

        // state topics
        mqttClient.subscribe(sw.stateTopics, function (err) {
            if (err) {
                console.log(`Error to subscribe ${JSON.stringify(sw.stateTopics)}`, err);
            }
        });

        // set topics
        mqttClient.subscribe(sw.setTopics, function (err) {
            if (err) {
                console.log(`Error to subscribe ${JSON.stringify(sw.setTopics)}`, err);
            }
        });
    }
}


function onMqttMessage (mqttClient: MQTT.MqttClient, topic: string, message: string) {
    const { switches } = ConfigService.getInstance().getConfig();


    for (const sw of switches) {
        // only go through set topics
        for (const setTopic of sw.setTopics) {
            if (topic === setTopic) {

                const newState = message.toString() as "ON" | "OFF";

                // publish to all channels via MQTT
                for (const stateTopic of sw.stateTopics) {
                    mqttClient.publish(
                        stateTopic,
                        newState,
                        {
                            retain: true,
                        }
                    );
                }

                // Set light leven via serial to hardware
                if (newState === "OFF") {
                    SerialService.sendFastCommand(`setSwitch -switch ${sw.sensorerId} -state off`);
                    continue;
                }
                SerialService.sendFastCommand(`setSwitch -switch ${sw.sensorerId} -state on`);
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