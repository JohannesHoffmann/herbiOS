import MQTT from "mqtt";
import ConfigService from "./ConfigService";
import { SubTopic, Topic } from "./IMqtt";
import {exec} from "child_process";
import ModemHiLink, { CellularConnectionStatus, ICellularStatus } from "./networking/ModemHiLink";

enum NetworkingTopics {
    interface = "interface",
    modem = "modem"
}

let modemList: {[key: string]: ModemHiLink} = {};

function onConnect (mqttClient: MQTT.MqttClient) {
    const { homeAssistantIntegration, networking } = ConfigService.getInstance().getConfig();
    const { interfaces, modems} = networking;

    // Register interfaces to HomeAssistant if enabled
    if (interfaces) {
        if (homeAssistantIntegration) {
            for (const inf of interfaces) {
                // Add a Button to switch interface on/off
                mqttClient.publish(
                    `homeassistant/switch/${NetworkingTopics.interface}_${inf.interfaceName}/config`, 
                    JSON.stringify({
                        "~": `homeassistant/switch/${NetworkingTopics.interface}_${inf.interfaceName}`,
                        "name": inf.name,
                        "unique_id": `${NetworkingTopics.interface}_${inf.interfaceName}`,
                        "cmd_t": "~/set",
                        "stat_t": "~/state",
                        "schema": "json",
                        "icon": "mdi:signal-variant"
                      })
                );
    
                // Add a sensor for signal strength
                mqttClient.publish(
                    `homeassistant/sensor/${NetworkingTopics.interface}_${inf.interfaceName}/config`, 
                    JSON.stringify({
                        "~": `homeassistant/sensor/${NetworkingTopics.interface}_${inf.interfaceName}`,
                        "name": `${inf.name} Signal strength`,
                        "unique_id": `${NetworkingTopics.interface}_${inf.interfaceName}`,
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


    if (modems) {
        // Register interfaces to HomeAssistant if enabled
        if (homeAssistantIntegration) {
            for (const modem of modems) {
                // Add a Button to switch interface on/off
                mqttClient.publish(
                    `homeassistant/switch/${NetworkingTopics.modem}_${modem.interfaceName}/config`, 
                    JSON.stringify({
                        "~": `homeassistant/switch/${NetworkingTopics.modem}_${modem.interfaceName}`,
                        "name": modem.name,
                        "unique_id": `${NetworkingTopics.modem}_${modem.interfaceName}`,
                        "cmd_t": "~/set",
                        "stat_t": "~/state",
                        "schema": "json",
                        "icon": "mdi:signal-cellular-3"
                    })
                );

                // Add a sensor for signal strength
                mqttClient.publish(
                    `homeassistant/sensor/${NetworkingTopics.modem}_${modem.interfaceName}_signal_strength/config`, 
                    JSON.stringify({
                        "~": `homeassistant/sensor/${NetworkingTopics.modem}_${modem.interfaceName}_signal_strength`,
                        "name": `${modem.name} Signal strength`,
                        "unique_id": `${NetworkingTopics.modem}_${modem.interfaceName}_signal_strength`,
                        "stat_t": "~/state",
                        "icon": "mdi:signal-cellular-3"
                    })
                );
                
                // Add a sensor for network type
                mqttClient.publish(
                    `homeassistant/sensor/${NetworkingTopics.modem}_${modem.interfaceName}_network_type/config`, 
                    JSON.stringify({
                        "~": `homeassistant/sensor/${NetworkingTopics.modem}_${modem.interfaceName}_network_type`,
                        "name": `${modem.name} Network`,
                        "unique_id": `${NetworkingTopics.modem}_${modem.interfaceName}_network_type`,
                        "stat_t": "~/state",
                        "icon": "mdi:signal-cellular-3"
                    })
                );
            }
        }

        // Register Interfaces to herbiOs
        for (const modem of modems) {
            mqttClient.publish(
                `${Topic.namespace}/${SubTopic.networking}/${NetworkingTopics.modem}/${modem.interfaceName}/${Topic.config}`, 
                JSON.stringify({
                    name: modem.name,
                    unique_id: modem.interfaceName,
                }),
                {
                    retain: true,
                }
            );
        }
        
        // initialize a modem connector
        for (const modem of modems) {
            modemList[modem.interfaceName] = new ModemHiLink(modem.ip);
        }

        setInterval(() => {
            modemStatus(mqttClient); // Set modem status every 20 seconds
        }, 20 * 1000);
    }


}

function subscribe (mqttClient: MQTT.MqttClient) {
    const { homeAssistantIntegration, networking} = ConfigService.getInstance().getConfig();
    const { interfaces, modems} = networking;

    if (interfaces) {
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
                inf.stateTopics.push(`homeassistant/switch/${NetworkingTopics.interface}_${inf.interfaceName}/state`);
                inf.setTopics.push(`homeassistant/switch/${NetworkingTopics.interface}_${inf.interfaceName}/set`);
                inf.signal_strength_state_topic.push(`homeassistant/sensor/${NetworkingTopics.interface}_${inf.interfaceName}/state`);
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


    if (modems) {
        for (const modem of modems) {
    
            // create array for topcis if not available
            if (!modem.stateTopics) {
                modem.stateTopics = [];
            }
            if (!modem.setTopics) {
                modem.setTopics = [];
            }
            if (!modem.signal_strength_state_topic) {
                modem.signal_strength_state_topic = [];
            }
            if (!modem.network_type_state_topic) {
                modem.network_type_state_topic = [];
            }
            
            // Add herbi default topics
            modem.stateTopics.push(`${Topic.namespace}/${SubTopic.networking}/${NetworkingTopics.modem}/${modem.interfaceName}/${Topic.state}`);
            modem.setTopics.push(`${Topic.namespace}/${SubTopic.networking}/${NetworkingTopics.modem}/${modem.interfaceName}/${Topic.set}`);
            modem.signal_strength_state_topic.push(`${Topic.namespace}/${SubTopic.networking}/${NetworkingTopics.modem}/${modem.interfaceName}/signal_strength`);
            modem.network_type_state_topic.push(`${Topic.namespace}/${SubTopic.networking}/${NetworkingTopics.modem}/${modem.interfaceName}/network_type`);
    
            // add HomeAssistant topics if integration is enabled
            if (homeAssistantIntegration) {
                modem.stateTopics.push(`homeassistant/switch/${NetworkingTopics.modem}_${modem.interfaceName}/state`);
                modem.setTopics.push(`homeassistant/switch/${NetworkingTopics.modem}_${modem.interfaceName}/set`);
                modem.signal_strength_state_topic.push(`homeassistant/sensor/${NetworkingTopics.modem}_${modem.interfaceName}_signal_strength/state`);
                modem.network_type_state_topic.push(`homeassistant/sensor/${NetworkingTopics.modem}_${modem.interfaceName}_network_type/state`);
            }
    
            // state topics
            mqttClient.subscribe(modem.stateTopics, function (err) {
                if (err) {
                    console.log(`Error to subscribe ${JSON.stringify(modem.stateTopics)}`, err);
                }
            });
    
            // set topics
            mqttClient.subscribe(modem.setTopics, function (err) {
                if (err) {
                    console.log(`Error to subscribe ${JSON.stringify(modem.setTopics)}`, err);
                }
            });
            
        }
    }


}


function onMqttMessage (mqttClient: MQTT.MqttClient, topic: string, message: string) {
    const { networking } = ConfigService.getInstance().getConfig();
    const { interfaces, modems} = networking;

    if (interfaces) {
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

    if (modems) {
        for (const modem of modems) {
            // Check main command topic
            for (const setTopic of modem.setTopics) {
                if (topic === setTopic) {
                    const newState = message as "ON" | "OFF";

                    try {
                        if (newState === "ON") {
                            modemList[modem.interfaceName].connect();
                        }
                        if (newState === "OFF") {
                            modemList[modem.interfaceName].disconnect();
                        }
        
                        // publish to all channels via MQTT
                        for (const stateTopic of modem.stateTopics) {
                            mqttClient.publish(
                                stateTopic,
                                newState,
                                {
                                    retain: true,
                                }
                            );
                        }
                    } catch (e) {
                        console.log("Error on Modem", e);
                    }
                }
            }
        }
    }
}

async function modemStatus(mqttClient: MQTT.MqttClient) {
    const { networking } = ConfigService.getInstance().getConfig();
    const { modems } = networking;
    if (!modems) {
        return;
    }
    
    for (const modem of modems) {
        if (!modemList[modem.interfaceName]) {
            continue;
        }

        try {
            let status = await modemList[modem.interfaceName].status();

            // update current connection
            for (const stateTopic of modem.setTopics) {
                mqttClient.publish(
                    stateTopic,
                    status.connectionStatus === CellularConnectionStatus.connected ? "ON" : "OFF",
                    {
                        retain: true,
                    }
                );
            }
    
    
            // update current signal strength
            for (const stateTopic of modem.signal_strength_state_topic) {
                mqttClient.publish(
                    stateTopic,
                    status.maxSignal.toString(),
                    {
                        retain: true,
                    }
                );
            }
    
            // Update current network type
            for (const stateTopic of modem.network_type_state_topic) {
                mqttClient.publish(
                    stateTopic,
                    status.currentNetworkType,
                    {
                        retain: true,
                    }
                );
            }
        } catch (e) {
            console.log("Modem Status Error", e);
        }

    }
}


export {
    onConnect,
    subscribe,
    onMqttMessage,
}