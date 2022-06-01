"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onSerialMessage = exports.onMqttMessage = exports.subscribe = exports.onConnect = void 0;
const ConfigService_1 = __importDefault(require("./ConfigService"));
const IMqtt_1 = require("./IMqtt");
const SerialService_1 = __importDefault(require("./SerialService"));
var FanTopics;
(function (FanTopics) {
    FanTopics["preset"] = "preset";
    FanTopics["speed"] = "speed";
})(FanTopics || (FanTopics = {}));
function onConnect(mqttClient) {
    const { homeAssistantIntegration, fans } = ConfigService_1.default.getInstance().getConfig();
    // Register fan to HomeAssistant if enabled
    if (homeAssistantIntegration) {
        for (const fan of fans) {
            mqttClient.publish(`homeassistant/fan/${fan.sensorerId}/config`, JSON.stringify({
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
            }));
        }
    }
    // Register Lights to herbiOs
    for (const fan of fans) {
        mqttClient.publish(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.fan}/${fan.sensorerId}/${IMqtt_1.Topic.config}`, JSON.stringify({
            name: fan.name,
            unique_id: fan.sensorerId,
            preset_modes: fan.preset_modes,
            speed: fan.speed,
        }), {
            retain: true,
        });
    }
}
exports.onConnect = onConnect;
function subscribe(mqttClient) {
    const { homeAssistantIntegration, fans } = ConfigService_1.default.getInstance().getConfig();
    for (const fan of fans) {
        // create array for topcis if not available
        if (!fan.stateTopics) {
            fan.stateTopics = [];
        }
        if (!fan.setTopics) {
            fan.setTopics = [];
        }
        // Add herbi default topics
        fan.stateTopics.push(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.fan}/${fan.sensorerId}/${IMqtt_1.Topic.state}`);
        fan.setTopics.push(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.fan}/${fan.sensorerId}/${IMqtt_1.Topic.set}`);
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
            if (fan.preset_modes && !fan.preset_mode_state_topic) {
                fan.preset_mode_state_topic = [];
            }
            if (!fan.preset_mode_command_topic) {
                fan.preset_mode_command_topic = [];
            }
            // Add herbi default topics
            fan.preset_mode_state_topic.push(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.fan}/${fan.sensorerId}/${FanTopics.preset}/${IMqtt_1.Topic.state}`);
            fan.preset_mode_command_topic.push(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.fan}/${fan.sensorerId}/${FanTopics.preset}/${IMqtt_1.Topic.set}`);
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
            fan.speed_state_topic.push(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.fan}/${fan.sensorerId}/${FanTopics.speed}/${IMqtt_1.Topic.state}`);
            fan.speed_command_topic.push(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.fan}/${fan.sensorerId}/${FanTopics.speed}/${IMqtt_1.Topic.set}`);
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
exports.subscribe = subscribe;
function onMqttMessage(mqttClient, topic, message) {
    const { fans } = ConfigService_1.default.getInstance().getConfig();
    for (const fan of fans) {
        // Check main command topic
        for (const setTopic of fan.setTopics) {
            if (topic === setTopic) {
                const newState = message;
                // publish to all channels via MQTT
                for (const stateTopic of fan.stateTopics) {
                    mqttClient.publish(stateTopic, newState, {
                        retain: true,
                    });
                }
                setFan(fan.sensorerId, "on", newState === "ON" ? true : false);
            }
        }
        // Check speed command topic
        if (fan.speed && fan.speed_command_topic) {
            for (const setTopic of fan.speed_command_topic) {
                if (topic === setTopic) {
                    const newState = Number(message);
                    // publish to all channels via MQTT
                    for (const stateTopic of fan.speed_state_topic) {
                        mqttClient.publish(stateTopic, newState.toString(), {
                            retain: true,
                        });
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
                        mqttClient.publish(stateTopic, newState, {
                            retain: true,
                        });
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
exports.onMqttMessage = onMqttMessage;
let fans = {};
let inOutInterval;
let inOutCurrentState;
function setFan(id, key, value) {
    if (!fans[id]) {
        fans[id] = {
            on: false,
            direction: "in",
            speed: 100,
        };
    }
    fans[id][key] = value;
    // Set fan via serial to hardware
    if (!fans[id].on) {
        SerialService_1.default.getInstance().sendFastCommand(`setFan -fan ${id} -direction off -level 0`);
        return;
    }
    if (inOutInterval)
        clearInterval(inOutInterval);
    switch (fans[id].direction) {
        case "in":
        case "out":
            SerialService_1.default.getInstance().sendFastCommand(`setFan -fan ${id} -direction ${fans[id].direction} -level ${Math.round(255 / 100 * fans[id].speed)} `);
            break;
        case "inOut":
            inOutCurrentState = "in";
            SerialService_1.default.getInstance().sendFastCommand(`setFan -fan ${id} -direction ${inOutCurrentState} -level ${Math.round(255 / 100 * fans[id].speed)} `);
            inOutInterval = setInterval(() => {
                if (inOutCurrentState === "in") {
                    inOutCurrentState = "out";
                }
                else {
                    inOutCurrentState = "in";
                }
                SerialService_1.default.getInstance().sendFastCommand(`setFan -fan ${id} -direction ${inOutCurrentState} -level ${Math.round(255 / 100 * fans[id].speed)} `);
            }, 1000 * 60 * 4);
    }
}
function onSerialMessage(message) {
}
exports.onSerialMessage = onSerialMessage;
//# sourceMappingURL=fans.js.map