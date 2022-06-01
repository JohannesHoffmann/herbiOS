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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMqttMessage = exports.subscribe = exports.onConnect = void 0;
const ConfigService_1 = __importDefault(require("./ConfigService"));
const IMqtt_1 = require("./IMqtt");
const child_process_1 = require("child_process");
const ModemHiLink_1 = __importStar(require("./networking/ModemHiLink"));
var NetworkingTopics;
(function (NetworkingTopics) {
    NetworkingTopics["interface"] = "interface";
    NetworkingTopics["modem"] = "modem";
})(NetworkingTopics || (NetworkingTopics = {}));
let modemList = {};
function onConnect(mqttClient) {
    const { homeAssistantIntegration, networking } = ConfigService_1.default.getInstance().getConfig();
    const { interfaces, modems } = networking;
    // Register interfaces to HomeAssistant if enabled
    if (interfaces) {
        if (homeAssistantIntegration) {
            for (const inf of interfaces) {
                // Add a Button to switch interface on/off
                mqttClient.publish(`homeassistant/switch/${NetworkingTopics.interface}_${inf.interfaceName}/config`, JSON.stringify({
                    "~": `homeassistant/switch/${NetworkingTopics.interface}_${inf.interfaceName}`,
                    "name": inf.name,
                    "unique_id": `${NetworkingTopics.interface}_${inf.interfaceName}`,
                    "cmd_t": "~/set",
                    "stat_t": "~/state",
                    "schema": "json",
                    "icon": "mdi:signal-variant"
                }));
                // Add a sensor for signal strength
                mqttClient.publish(`homeassistant/sensor/${NetworkingTopics.interface}_${inf.interfaceName}/config`, JSON.stringify({
                    "~": `homeassistant/sensor/${NetworkingTopics.interface}_${inf.interfaceName}`,
                    "name": `${inf.name} Signal strength`,
                    "unique_id": `${NetworkingTopics.interface}_${inf.interfaceName}`,
                    "stat_t": "~/state",
                    "icon": "mdi:signal-variant"
                }));
            }
        }
        // Register Interfaces to herbiOs
        for (const inf of interfaces) {
            mqttClient.publish(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.networking}/${NetworkingTopics.interface}/${inf.interfaceName}/${IMqtt_1.Topic.config}`, JSON.stringify({
                name: inf.name,
                unique_id: inf.interfaceName,
            }), {
                retain: true,
            });
        }
    }
    if (modems) {
        // Register interfaces to HomeAssistant if enabled
        if (homeAssistantIntegration) {
            for (const modem of modems) {
                // Add a Button to switch interface on/off
                mqttClient.publish(`homeassistant/switch/${NetworkingTopics.modem}_${modem.interfaceName}/config`, JSON.stringify({
                    "~": `homeassistant/switch/${NetworkingTopics.modem}_${modem.interfaceName}`,
                    "name": modem.name,
                    "unique_id": `${NetworkingTopics.modem}_${modem.interfaceName}`,
                    "cmd_t": "~/set",
                    "stat_t": "~/state",
                    "schema": "json",
                    "icon": "mdi:signal-cellular-3"
                }));
                // Add a sensor for signal strength
                mqttClient.publish(`homeassistant/sensor/${NetworkingTopics.modem}_${modem.interfaceName}_signal_strength/config`, JSON.stringify({
                    "~": `homeassistant/sensor/${NetworkingTopics.modem}_${modem.interfaceName}_signal_strength`,
                    "name": `${modem.name} Signal strength`,
                    "unique_id": `${NetworkingTopics.modem}_${modem.interfaceName}_signal_strength`,
                    "stat_t": "~/state",
                    "icon": "mdi:signal-cellular-3"
                }));
                // Add a sensor for network type
                mqttClient.publish(`homeassistant/sensor/${NetworkingTopics.modem}_${modem.interfaceName}_network_type/config`, JSON.stringify({
                    "~": `homeassistant/sensor/${NetworkingTopics.modem}_${modem.interfaceName}_network_type`,
                    "name": `${modem.name} Network`,
                    "unique_id": `${NetworkingTopics.modem}_${modem.interfaceName}_network_type`,
                    "stat_t": "~/state",
                    "icon": "mdi:signal-cellular-3"
                }));
            }
        }
        // Register Interfaces to herbiOs
        for (const modem of modems) {
            mqttClient.publish(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.networking}/${NetworkingTopics.modem}/${modem.interfaceName}/${IMqtt_1.Topic.config}`, JSON.stringify({
                name: modem.name,
                unique_id: modem.interfaceName,
            }), {
                retain: true,
            });
        }
        // initialize a modem connector
        for (const modem of modems) {
            modemList[modem.interfaceName] = new ModemHiLink_1.default(modem.ip);
        }
        setInterval(() => {
            modemStatus(mqttClient); // Set modem status every 20 seconds
        }, 20 * 1000);
    }
}
exports.onConnect = onConnect;
function subscribe(mqttClient) {
    const { homeAssistantIntegration, networking } = ConfigService_1.default.getInstance().getConfig();
    const { interfaces, modems } = networking;
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
            inf.stateTopics.push(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.networking}/${NetworkingTopics.interface}/${inf.interfaceName}/${IMqtt_1.Topic.state}`);
            inf.setTopics.push(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.networking}/${NetworkingTopics.interface}/${inf.interfaceName}/${IMqtt_1.Topic.set}`);
            inf.signal_strength_state_topic.push(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.networking}/${NetworkingTopics.interface}/${inf.interfaceName}/signal_strength`);
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
            modem.stateTopics.push(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.networking}/${NetworkingTopics.modem}/${modem.interfaceName}/${IMqtt_1.Topic.state}`);
            modem.setTopics.push(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.networking}/${NetworkingTopics.modem}/${modem.interfaceName}/${IMqtt_1.Topic.set}`);
            modem.signal_strength_state_topic.push(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.networking}/${NetworkingTopics.modem}/${modem.interfaceName}/signal_strength`);
            modem.network_type_state_topic.push(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.networking}/${NetworkingTopics.modem}/${modem.interfaceName}/network_type`);
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
exports.subscribe = subscribe;
function onMqttMessage(mqttClient, topic, message) {
    const { networking } = ConfigService_1.default.getInstance().getConfig();
    const { interfaces, modems } = networking;
    if (interfaces) {
        for (const inf of interfaces) {
            // Check main command topic
            for (const setTopic of inf.setTopics) {
                if (topic === setTopic) {
                    const newState = message;
                    const command = newState === "ON" ? "up" : "down";
                    child_process_1.exec(`sudo ifconfig ${inf.interfaceName} ${command}`, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`exec error: ${error}`);
                            return;
                        }
                        console.log(`Interface ${inf.interfaceName} is ${newState}`, stdout);
                    });
                    // publish to all channels via MQTT
                    for (const stateTopic of inf.stateTopics) {
                        mqttClient.publish(stateTopic, newState, {
                            retain: true,
                        });
                    }
                }
            }
            for (const stateTopic of inf.signal_strength_state_topic) {
                mqttClient.publish(stateTopic, "5", {
                    retain: true,
                });
            }
        }
    }
    if (modems) {
        for (const modem of modems) {
            // Check main command topic
            for (const setTopic of modem.setTopics) {
                if (topic === setTopic) {
                    const newState = message;
                    try {
                        if (newState === "ON") {
                            modemList[modem.interfaceName].connect();
                        }
                        if (newState === "OFF") {
                            modemList[modem.interfaceName].disconnect();
                        }
                        // publish to all channels via MQTT
                        for (const stateTopic of modem.stateTopics) {
                            mqttClient.publish(stateTopic, newState, {
                                retain: true,
                            });
                        }
                    }
                    catch (e) {
                        console.log("Error on Modem", e);
                    }
                }
            }
        }
    }
}
exports.onMqttMessage = onMqttMessage;
function modemStatus(mqttClient) {
    return __awaiter(this, void 0, void 0, function* () {
        const { networking } = ConfigService_1.default.getInstance().getConfig();
        const { modems } = networking;
        if (!modems) {
            return;
        }
        for (const modem of modems) {
            if (!modemList[modem.interfaceName]) {
                continue;
            }
            try {
                let status = yield modemList[modem.interfaceName].status();
                // update current connection
                for (const stateTopic of modem.setTopics) {
                    mqttClient.publish(stateTopic, status.connectionStatus === ModemHiLink_1.CellularConnectionStatus.connected ? "ON" : "OFF", {
                        retain: true,
                    });
                }
                // update current signal strength
                for (const stateTopic of modem.signal_strength_state_topic) {
                    mqttClient.publish(stateTopic, status.maxSignal.toString(), {
                        retain: true,
                    });
                }
                // Update current network type
                for (const stateTopic of modem.network_type_state_topic) {
                    mqttClient.publish(stateTopic, status.currentNetworkType, {
                        retain: true,
                    });
                }
            }
            catch (e) {
                console.log("Modem Status Error", e);
            }
        }
    });
}
//# sourceMappingURL=networking.js.map