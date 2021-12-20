import MQTT from "mqtt";
import ConfigService from "./ConfigService";
import { SubTopic, Topic } from "./IMqtt";
import SerialService from "./SerialService";

enum FanTopics {
    preset = "preset",
    speed = "speed"
}

function onConnect (mqttClient: MQTT.MqttClient) {
    const { homeAssistantIntegration, fans } = ConfigService.getInstance().getConfig();

    // Register fan to HomeAssistant if enabled
    if (homeAssistantIntegration) {
        for (const fan of fans) {
            mqttClient.publish(
                `homeassistant/fan/${fan.sensorerId}/config`, 
                JSON.stringify({
                    "~": `homeassistant/fan/${fan.sensorerId}`,
                    name: fan.name,
                    unique_id: fan.sensorerId,
                    cmd_t: "~/set",
                    stat_t: "~/state",
                    schema: "json",
                    preset_modes: fan.preset_modes,
                    preset_mode_command_topic: fan.preset_modes ? "~/preset/set" : undefined,
                    preset_mode_state_topic: fan.preset_modes ? "~/preset/state" : undefined,
                    percentage_command_topic: fan.speed ? "~/percentage/set" : undefined,
                    percentage_state_topic: fan.speed ? "~/percentage/state" : undefined,
                })
            );
        }
    }

    // Register Lights to herbiOs
    for (const fan of fans) {
        mqttClient.publish(
            `${Topic.namespace}/${SubTopic.fan}/${fan.sensorerId}/${Topic.config}`, 
            JSON.stringify({
                name: fan.name,
                unique_id: fan.sensorerId,
                preset_modes: fan.preset_modes,
                speed: fan.speed,
              }),
              {
                  retain: true,
              }
        );
    }
}

function subscribe (mqttClient: MQTT.MqttClient) {
    const { homeAssistantIntegration, fans} = ConfigService.getInstance().getConfig();

    for (const fan of fans) {

        // create array for topcis if not available
        if (!fan.stateTopics) {
            fan.stateTopics = [];
        }
        if (!fan.setTopics) {
            fan.setTopics = [];
        }
        
        // Add herbi default topics
        fan.stateTopics.push(`${Topic.namespace}/${SubTopic.fan}/${fan.sensorerId}/${Topic.state}`);
        fan.setTopics.push(`${Topic.namespace}/${SubTopic.fan}/${fan.sensorerId}/${Topic.set}`);

        // add HomeAssistant topics if integration is enabled
        if (homeAssistantIntegration) {
            fan.stateTopics.push(`homeassistant/fan/${fan.sensorerId}/state`);
            fan.setTopics.push(`homeassistant/fan/${fan.sensorerId}/set`);
        }

        // state topics
        mqttClient.subscribe(fan.stateTopics, function (err) {
            if (err) {
                console.log(`Error to subscribe ${JSON.stringify(fan.stateTopics)}`, err);
            }
        });

        // set topics
        mqttClient.subscribe(fan.setTopics, function (err) {
            if (err) {
                console.log(`Error to subscribe ${JSON.stringify(fan.setTopics)}`, err);
            }
        });


        // PRESET TOPICS
        if (fan.preset_modes) {
            // create array for topcis if not available
            if (fan.preset_modes &&!fan.preset_mode_state_topic) {
                fan.preset_mode_state_topic = [];
            }
            if (!fan.preset_mode_command_topic) {
                fan.preset_mode_command_topic = [];
            }
            
            // Add herbi default topics
            fan.preset_mode_state_topic.push(`${Topic.namespace}/${SubTopic.fan}/${fan.sensorerId}/${FanTopics.preset}/${Topic.state}`);
            fan.preset_mode_command_topic.push(`${Topic.namespace}/${SubTopic.fan}/${fan.sensorerId}/${FanTopics.preset}/${Topic.set}`);

            // add HomeAssistant topics if integration is enabled
            if (homeAssistantIntegration) {
                fan.preset_mode_state_topic.push(`homeassistant/fan/${fan.sensorerId}/preset/state`);
                fan.preset_mode_command_topic.push(`homeassistant/fan/${fan.sensorerId}/preset/set`);
            }

            // state topics
            mqttClient.subscribe(fan.preset_mode_state_topic, function (err) {
                if (err) {
                    console.log(`Error to subscribe ${JSON.stringify(fan.preset_mode_state_topic)}`, err);
                }
            });

            // set topics
            mqttClient.subscribe(fan.preset_mode_command_topic, function (err) {
                if (err) {
                    console.log(`Error to subscribe ${JSON.stringify(fan.preset_mode_command_topic)}`, err);
                }
            });
        }
        // /PRESET TOPICS
        


        // SPEED TOPICS
        if (fan.speed) {
            if (!fan.speed_state_topic) {
                fan.speed_state_topic = [];
            }
            if (!fan.speed_command_topic) {
                fan.speed_command_topic = [];
            }
            
            // Add herbi default topics
            fan.speed_state_topic.push(`${Topic.namespace}/${SubTopic.fan}/${fan.sensorerId}/${FanTopics.speed}/${Topic.state}`);
            fan.speed_command_topic.push(`${Topic.namespace}/${SubTopic.fan}/${fan.sensorerId}/${FanTopics.speed}/${Topic.set}`);
    
            // add HomeAssistant topics if integration is enabled
            if (homeAssistantIntegration) {
                fan.speed_state_topic.push(`homeassistant/fan/${fan.sensorerId}/percentage/state`);
                fan.speed_command_topic.push(`homeassistant/fan/${fan.sensorerId}/percentage/set`);
            }
    
            // state topics
            mqttClient.subscribe(fan.speed_state_topic, function (err) {
                if (err) {
                    console.log(`Error to subscribe ${JSON.stringify(fan.speed_state_topic)}`, err);
                }
            });
    
            // set topics
            mqttClient.subscribe(fan.speed_command_topic, function (err) {
                if (err) {
                    console.log(`Error to subscribe ${JSON.stringify(fan.speed_command_topic)}`, err);
                }
            });
        }
        // /SPEED TOPICS

    }
}


function onMqttMessage (mqttClient: MQTT.MqttClient, topic: string, message: string) {
    const { fans} = ConfigService.getInstance().getConfig();

    for (const fan of fans) {
        // Check main command topic
        for (const setTopic of fan.setTopics) {
            if (topic === setTopic) {
                const newState = message as "ON" | "OFF";
                // publish to all channels via MQTT
                for (const stateTopic of fan.stateTopics) {
                    mqttClient.publish(
                        stateTopic,
                        newState,
                        {
                            retain: true,
                        }
                    );
                }

                setFan(fan.sensorerId, "on", newState === "ON" ? true : false);
            }
        }

        // Check speed command topic
        if (fan.speed && fan.speed_command_topic) {
            for (const setTopic of fan.speed_command_topic) {
                if (topic === setTopic) {
                    const newState: number = Number(message);
    
                    // publish to all channels via MQTT
                    for (const stateTopic of fan.speed_state_topic) {
                        mqttClient.publish(
                            stateTopic,
                            newState.toString(),
                            {
                                retain: true,
                            }
                        );
                    }
    
                    setFan(fan.sensorerId, "speed", newState);
                }
            }
        }

        // Check preset mode command topic
        if (fan.preset_modes && fan.preset_mode_command_topic) {
            for (const setTopic of fan.preset_mode_command_topic) {
                if (topic === setTopic) {
                    const newState = message;
    
                    // publish to all channels via MQTT
                    for (const stateTopic of fan.preset_mode_state_topic) {
                        mqttClient.publish(
                            stateTopic,
                            newState,
                            {
                                retain: true,
                            }
                        );
                    }
    
                    switch (newState) {
                        case "in":
                        case "out":
                        case "inOut":
                            setFan(fan.sensorerId, "direction", newState);
                            break;
                            
                        default:
                            setFan(fan.sensorerId, "direction", "in");
                    }
                }
            }
        }


    }
}

interface FanState {
    on: boolean;
    direction: "in" | "out" | "inOut",
    speed: number;
}

let fans: {
    [key: string]: FanState
} = {};

let inOutInterval: NodeJS.Timeout;
let inOutCurrentState: "in" | "out";

function setFan<K extends keyof FanState>(id: string, key: K, value: FanState[K] ) {
    if (!fans[id]) {
        fans[id] = {
            on: false,
            direction: "in",
            speed: 100,
        }
    }
    
    fans[id][key] = value;

    // Set fan via serial to hardware
    if (!fans[id].on) {
        SerialService.sendFastCommand(`setFan -fan ${id} -direction off -level 0`);
        return;
    }

    if (inOutInterval) clearInterval(inOutInterval);
    
    switch (fans[id].direction) {
        case "in":
        case "out":
            SerialService.sendFastCommand(`setFan -fan ${id} -direction ${fans[id].direction} -level ${Math.round(255 / 100 * fans[id].speed)} `);
            break;
            
        case "inOut":
            inOutCurrentState = "in";    
            SerialService.sendFastCommand(`setFan -fan ${id} -direction ${inOutCurrentState} -level ${Math.round(255 / 100 * fans[id].speed)} `);

            inOutInterval = setInterval(() => {
                if (inOutCurrentState === "in") {
                    inOutCurrentState = "out";
                } else {
                    inOutCurrentState = "in";
                }
                SerialService.sendFastCommand(`setFan -fan ${id} -direction ${inOutCurrentState} -level ${Math.round(255 / 100 * fans[id].speed)} `);
            }, 1000 * 60 * 4);

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