"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onSerialMessage = exports.onMqttMessage = exports.subscribe = exports.onConnect = exports.SwitchTopic = void 0;
const ConfigService_1 = __importDefault(require("./ConfigService"));
const IMqtt_1 = require("./IMqtt");
const SerialService_1 = __importDefault(require("./SerialService"));
var SwitchTopic;
(function (SwitchTopic) {
    SwitchTopic["namespace"] = "switches";
    SwitchTopic["prefix"] = "switch";
})(SwitchTopic = exports.SwitchTopic || (exports.SwitchTopic = {}));
function onConnect(mqttClient) {
    const { homeAssistantIntegration, switches } = ConfigService_1.default.getInstance().getConfig();
    // Register switches to HomeAssistant if enabled
    if (homeAssistantIntegration) {
        for (const sw of switches) {
            mqttClient.publish(`homeassistant/switch/${SwitchTopic.prefix}${sw.sensorerId}/config`, JSON.stringify({
                "~": `homeassistant/switch/${SwitchTopic.prefix}${sw.sensorerId}`,
                "name": sw.name,
                "unique_id": SwitchTopic.prefix + sw.sensorerId,
                "cmd_t": "~/set",
                "stat_t": "~/state",
                "schema": "json",
            }));
        }
    }
    // Register switches to herbiOs
    for (const sw of switches) {
        mqttClient.publish(`${IMqtt_1.Topic.namespace}/${SwitchTopic.namespace}/${SwitchTopic.prefix}${sw.sensorerId}/${IMqtt_1.Topic.config}`, JSON.stringify({
            "name": sw.name,
            "unique_id": SwitchTopic.prefix + sw.sensorerId,
        }), {
            retain: true,
        });
    }
}
exports.onConnect = onConnect;
function subscribe(mqttClient) {
    const { homeAssistantIntegration, switches } = ConfigService_1.default.getInstance().getConfig();
    for (const sw of switches) {
        // create array for topcis if not available
        if (!sw.stateTopics) {
            sw.stateTopics = [];
        }
        if (!sw.setTopics) {
            sw.setTopics = [];
        }
        // Add herb default topics
        sw.stateTopics.push(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.switch}/${SwitchTopic.prefix}${sw.sensorerId}/${IMqtt_1.Topic.state}`);
        sw.setTopics.push(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.switch}/${SwitchTopic.prefix}${sw.sensorerId}/${IMqtt_1.Topic.set}`);
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
exports.subscribe = subscribe;
function onMqttMessage(mqttClient, topic, message) {
    const { switches } = ConfigService_1.default.getInstance().getConfig();
    for (const sw of switches) {
        // only go through set topics
        for (const setTopic of sw.setTopics) {
            if (topic === setTopic) {
                const newState = message.toString();
                // publish to all channels via MQTT
                for (const stateTopic of sw.stateTopics) {
                    mqttClient.publish(stateTopic, newState, {
                        retain: true,
                    });
                }
                // Set light leven via serial to hardware
                if (newState === "OFF" && sw.reverse) {
                    SerialService_1.default.getInstance().sendFastCommand(`setSwitch -switch ${sw.sensorerId} -state on`);
                    continue;
                }
                if (newState === "ON" && sw.reverse) {
                    SerialService_1.default.getInstance().sendFastCommand(`setSwitch -switch ${sw.sensorerId} -state off`);
                    continue;
                }
                if (newState === "OFF" && !sw.reverse) {
                    SerialService_1.default.getInstance().sendFastCommand(`setSwitch -switch ${sw.sensorerId} -state off`);
                    continue;
                }
                SerialService_1.default.getInstance().sendFastCommand(`setSwitch -switch ${sw.sensorerId} -state on`);
            }
        }
    }
}
exports.onMqttMessage = onMqttMessage;
function onSerialMessage(message) {
}
exports.onSerialMessage = onSerialMessage;
//# sourceMappingURL=switches.js.map