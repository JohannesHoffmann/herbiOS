"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onSerialMessage = exports.onMqttMessage = exports.subscribe = exports.onConnect = void 0;
const ConfigService_1 = __importDefault(require("./ConfigService"));
const IMqtt_1 = require("./IMqtt");
const SerialService_1 = __importStar(require("./SerialService"));
var ClimateTopics;
(function (ClimateTopics) {
    ClimateTopics["currentTemp"] = "currentTemp";
    ClimateTopics["targetTemp"] = "targetTemp";
    ClimateTopics["fanMode"] = "fan_mode";
    ClimateTopics["preset"] = "preset";
    ClimateTopics["mode"] = "mode";
    ClimateTopics["availability"] = "availabilty";
})(ClimateTopics || (ClimateTopics = {}));
function onConnect(mqttClient) {
    const { homeAssistantIntegration, climates } = ConfigService_1.default.getInstance().getConfig();
    // Register fan to HomeAssistant if enabled
    if (homeAssistantIntegration) {
        for (const fan of climates) {
            mqttClient.publish(`homeassistant/climate/${fan.sensorerId}/config`, JSON.stringify({
                "~": `homeassistant/climate/${fan.sensorerId}`,
                name: fan.name,
                unique_id: fan.sensorerId,
                schema: "json",
                fan_modes: fan.fan_modes,
                fan_mode_state_topic: fan.fan_modes ? `~/fan_mode/state` : undefined,
                fan_mode_command_topic: fan.fan_modes ? `~/fan_mode/set` : undefined,
                modes: fan.modes,
                mode_state_topic: fan.modes ? `~/mode/state` : undefined,
                mode_command_topic: fan.modes ? `~/mode/set` : undefined,
                preset_modes: fan.preset_modes,
                preset_mode_command_topic: fan.preset_modes ? "~/preset/set" : undefined,
                preset_mode_state_topic: fan.preset_modes ? "~/preset/state" : undefined,
                initial: fan.temperature_initial ? fan.temperature_initial : undefined,
                temperature_command_topic: `~/temperature/set`,
                temperature_state_topic: `~/temperature/state`,
                current_temperature_topic: '~/temp_current',
                availability_topic: '~/available',
                precision: 0.1,
            }));
        }
    }
    // Register Lights to herbiOs
    for (const climate of climates) {
        mqttClient.publish(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.climate}/${climate.sensorerId}/${IMqtt_1.Topic.config}`, JSON.stringify({
            name: climate.name,
            unique_id: climate.sensorerId,
            modes: climate.modes,
            fan_modes: climate.fan_modes,
            preset_modes: climate.preset_modes,
            temperature_initial: climate.temperature_initial,
        }), {
            retain: true,
        });
    }
}
exports.onConnect = onConnect;
function subscribe(mqttClient) {
    const { homeAssistantIntegration, climates } = ConfigService_1.default.getInstance().getConfig();
    for (const climate of climates) {
        // MODES TOPICS
        if (climate.modes) {
            // create array for topcis if not available
            if (climate.modes && !climate.mode_state_topic) {
                climate.mode_state_topic = [];
            }
            if (!climate.mode_command_topic) {
                climate.mode_command_topic = [];
            }
            // Add herbi default topics
            climate.mode_state_topic.push(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.climate}/${climate.sensorerId}/${ClimateTopics.mode}/${IMqtt_1.Topic.state}`);
            climate.mode_command_topic.push(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.climate}/${climate.sensorerId}/${ClimateTopics.mode}/${IMqtt_1.Topic.set}`);
            // add HomeAssistant topics if integration is enabled
            if (homeAssistantIntegration) {
                climate.mode_state_topic.push(`homeassistant/climate/${climate.sensorerId}/mode/state`);
                climate.mode_command_topic.push(`homeassistant/climate/${climate.sensorerId}/mode/set`);
            }
            // state topics
            mqttClient.subscribe(climate.mode_state_topic, function (err) {
                if (err) {
                    console.log(`Error to subscribe ${JSON.stringify(climate.mode_state_topic)}`, err);
                }
            });
            // set topics
            mqttClient.subscribe(climate.mode_command_topic, function (err) {
                if (err) {
                    console.log(`Error to subscribe ${JSON.stringify(climate.mode_command_topic)}`, err);
                }
            });
        }
        // /MODES TOPICS
        // PRESET TOPICS
        if (climate.preset_modes) {
            // create array for topcis if not available
            if (climate.preset_modes && !climate.preset_mode_state_topic) {
                climate.preset_mode_state_topic = [];
            }
            if (!climate.preset_mode_command_topic) {
                climate.preset_mode_command_topic = [];
            }
            // Add herbi default topics
            climate.preset_mode_state_topic.push(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.climate}/${climate.sensorerId}/${ClimateTopics.preset}/${IMqtt_1.Topic.state}`);
            climate.preset_mode_command_topic.push(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.climate}/${climate.sensorerId}/${ClimateTopics.preset}/${IMqtt_1.Topic.set}`);
            // add HomeAssistant topics if integration is enabled
            if (homeAssistantIntegration) {
                climate.preset_mode_state_topic.push(`homeassistant/climate/${climate.sensorerId}/preset/state`);
                climate.preset_mode_command_topic.push(`homeassistant/climate/${climate.sensorerId}/preset/set`);
            }
            // state topics
            mqttClient.subscribe(climate.preset_mode_state_topic, function (err) {
                if (err) {
                    console.log(`Error to subscribe ${JSON.stringify(climate.preset_mode_state_topic)}`, err);
                }
            });
            // set topics
            mqttClient.subscribe(climate.preset_mode_command_topic, function (err) {
                if (err) {
                    console.log(`Error to subscribe ${JSON.stringify(climate.preset_mode_command_topic)}`, err);
                }
            });
        }
        // /PRESET TOPICS
        // FAN MODE TOPICS
        if (climate.fan_modes) {
            if (!climate.fan_mode_state_topic) {
                climate.fan_mode_state_topic = [];
            }
            if (!climate.fan_mode_command_topic) {
                climate.fan_mode_command_topic = [];
            }
            // Add herbi default topics
            climate.fan_mode_state_topic.push(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.climate}/${climate.sensorerId}/${ClimateTopics.fanMode}/${IMqtt_1.Topic.state}`);
            climate.fan_mode_command_topic.push(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.climate}/${climate.sensorerId}/${ClimateTopics.fanMode}/${IMqtt_1.Topic.set}`);
            // add HomeAssistant topics if integration is enabled
            if (homeAssistantIntegration) {
                climate.fan_mode_state_topic.push(`homeassistant/climate/${climate.sensorerId}/fan_mode/state`);
                climate.fan_mode_command_topic.push(`homeassistant/climate/${climate.sensorerId}/fan_mode/set`);
            }
            // state topics
            mqttClient.subscribe(climate.fan_mode_state_topic, function (err) {
                if (err) {
                    console.log(`Error to subscribe ${JSON.stringify(climate.fan_mode_state_topic)}`, err);
                }
            });
            // set topics
            mqttClient.subscribe(climate.fan_mode_command_topic, function (err) {
                if (err) {
                    console.log(`Error to subscribe ${JSON.stringify(climate.fan_mode_command_topic)}`, err);
                }
            });
        }
        // /FAN MODE TOPICS
        // TEMPERATURE TOPICS
        if (!climate.temperature_command_topic) {
            climate.temperature_command_topic = [];
        }
        if (!climate.temperature_state_topic) {
            climate.temperature_state_topic = [];
        }
        if (!climate.temperature_current_topic) {
            climate.temperature_current_topic = [];
        }
        if (!climate.availability_topic) {
            climate.availability_topic = [];
        }
        // Add herbi default topics
        climate.temperature_command_topic.push(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.climate}/${climate.sensorerId}/${ClimateTopics.targetTemp}/${IMqtt_1.Topic.set}`);
        climate.temperature_state_topic.push(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.climate}/${climate.sensorerId}/${ClimateTopics.targetTemp}/${IMqtt_1.Topic.state}`);
        climate.temperature_current_topic.push(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.climate}/${climate.sensorerId}/${ClimateTopics.currentTemp}`);
        // add HomeAssistant topics if integration is enabled
        if (homeAssistantIntegration) {
            climate.temperature_command_topic.push(`homeassistant/climate/${climate.sensorerId}/temperature/set`);
            climate.temperature_state_topic.push(`homeassistant/climate/${climate.sensorerId}/temperature/state`);
            climate.temperature_current_topic.push(`homeassistant/climate/${climate.sensorerId}/temp_current`);
            climate.availability_topic.push(`homeassistant/climate/${climate.sensorerId}/available`);
        }
        // state topics
        mqttClient.subscribe(climate.temperature_state_topic, function (err) {
            if (err) {
                console.log(`Error to subscribe ${JSON.stringify(climate.temperature_state_topic)}`, err);
            }
        });
        // set topics
        mqttClient.subscribe(climate.temperature_command_topic, function (err) {
            if (err) {
                console.log(`Error to subscribe ${JSON.stringify(climate.temperature_command_topic)}`, err);
            }
        });
        // set topics
        mqttClient.subscribe(climate.temperature_current_topic, function (err) {
            if (err) {
                console.log(`Error to subscribe ${JSON.stringify(climate.temperature_current_topic)}`, err);
            }
        });
        // /TEMPERATURE TOPICS
        // INITIAL TEMPERATURE
        if (climate.temperature_initial) {
            for (const stateTopic of climate.temperature_state_topic) {
                mqttClient.publish(stateTopic, climate.temperature_initial.toString(), {
                    retain: true,
                });
            }
        }
        // AVAILABLE
        if (climate.temperature_initial) {
            for (const stateTopic of climate.availability_topic) {
                mqttClient.publish(stateTopic, "online", {
                    retain: true,
                });
            }
        }
    }
}
exports.subscribe = subscribe;
function onMqttMessage(mqttClient, topic, message) {
    const { climates } = ConfigService_1.default.getInstance().getConfig();
    for (const climate of climates) {
        // Check preset mode command topic
        if (climate.modes && climate.mode_command_topic) {
            for (const setTopic of climate.mode_command_topic) {
                if (topic === setTopic) {
                    const newState = message;
                    // publish to all channels via MQTT
                    for (const stateTopic of climate.mode_state_topic) {
                        mqttClient.publish(stateTopic, newState, {
                            retain: true,
                        });
                    }
                    setClimate(climate.sensorerId, "mode", newState);
                }
            }
        }
        // Check fan_modes command topic
        if (climate.fan_modes && climate.fan_mode_command_topic) {
            for (const setTopic of climate.fan_mode_command_topic) {
                if (topic === setTopic) {
                    const newState = message;
                    // publish to all channels via MQTT
                    for (const stateTopic of climate.fan_mode_state_topic) {
                        mqttClient.publish(stateTopic, newState, {
                            retain: true,
                        });
                    }
                    setClimate(climate.sensorerId, "fanMode", newState);
                }
            }
        }
        // Check preset mode command topic
        if (climate.preset_modes && climate.preset_mode_command_topic) {
            for (const setTopic of climate.preset_mode_command_topic) {
                if (topic === setTopic) {
                    const newState = message;
                    // publish to all channels via MQTT
                    for (const stateTopic of climate.preset_mode_state_topic) {
                        mqttClient.publish(stateTopic, newState, {
                            retain: true,
                        });
                    }
                    setClimate(climate.sensorerId, "preset", newState);
                }
            }
        }
        // Check temperature command topic
        if (climate.temperature_command_topic) {
            for (const setTopic of climate.temperature_command_topic) {
                if (topic === setTopic) {
                    const newState = message;
                    // publish to all channels via MQTT
                    for (const stateTopic of climate.temperature_state_topic) {
                        mqttClient.publish(stateTopic, newState, {
                            retain: true,
                        });
                    }
                    setClimate(climate.sensorerId, "temperature", Number(newState));
                }
            }
        }
    }
}
exports.onMqttMessage = onMqttMessage;
let climates = {};
function setClimate(id, key, value) {
    if (!climates[id]) {
        const { climates: climateList } = ConfigService_1.default.getInstance().getConfig();
        const climate = climateList.find(c => c.sensorerId === id);
        if (climate) {
            climates[id] = {
                mode: climate.modes ? climate.modes[0] : "off",
                preset: climate.preset_modes ? climate.preset_modes[0] : "automatic",
                fanMode: climate.fan_modes ? climate.fan_modes[0] : "1",
                temperature: climate.temperature_initial ? climate.temperature_initial : 18,
            };
        }
        if (!climate) {
            return;
        }
    }
    climates[id][key] = value;
    const climate = climates[id];
    // HEATER OFF
    if (climate.mode === "off") {
        SerialService_1.default.getInstance().sendFastCommand(`heater -do stop`);
        // Resend command after 2 seconds to go for sure it will go off
        setTimeout(() => {
            SerialService_1.default.getInstance().sendFastCommand(`heater -do stop`);
        }, 2000);
        return;
    }
    // HEATER MANUAL
    if (climate.preset === "manual") {
        const strength = Number(climate.fanMode);
        if (strength !== NaN && strength >= 0 && strength <= 10) {
            if (climate.mode === "heat") {
                SerialService_1.default.getInstance().sendFastCommand(`heater -do heat${strength}`);
            }
            if (climate.mode === "fan_only") {
                SerialService_1.default.getInstance().sendFastCommand(`heater -do fan${strength}`);
            }
        }
        return;
    }
    // HEATER AUTOMATIC
    if (climate.preset === "automatic") {
        // not implemented yet
        return;
    }
}
function onSerialMessage(message, mqttClient) {
    const { climates } = ConfigService_1.default.getInstance().getConfig();
    const [type, value] = message.toString().split(SerialService_1.SerialStuff.delimiter);
    if (type === "temp") {
        for (const climate of climates) {
            for (const stateTopic of climate.temperature_current_topic) {
                mqttClient.publish(stateTopic, value, {
                    retain: true,
                });
            }
        }
    }
}
exports.onSerialMessage = onSerialMessage;
//# sourceMappingURL=climates.js.map