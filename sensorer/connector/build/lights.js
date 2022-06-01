"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onSerialMessage = exports.onMqttMessage = exports.subscribe = exports.onConnect = void 0;
const ConfigService_1 = __importDefault(require("./ConfigService"));
const IMqtt_1 = require("./IMqtt");
const SerialService_1 = __importDefault(require("./SerialService"));
function onConnect(mqttClient) {
    const { homeAssistantIntegration, lights } = ConfigService_1.default.getInstance().getConfig();
    // Register light to HomeAssistant if enabled
    if (homeAssistantIntegration) {
        for (const light of lights) {
            mqttClient.publish(`homeassistant/light/${light.sensorerId}/config`, JSON.stringify({
                "~": `homeassistant/light/${light.sensorerId}`,
                "name": light.name,
                "unique_id": light.sensorerId,
                "cmd_t": "~/set",
                "stat_t": "~/state",
                "schema": "json",
                "brightness": light.brightness
            }));
        }
    }
    // Register Lights to herbiOs
    for (const light of lights) {
        mqttClient.publish(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.light}/${light.sensorerId}/${IMqtt_1.Topic.config}`, JSON.stringify({
            "name": light.name,
            "unique_id": light.sensorerId,
            "brightness": light.brightness
        }), {
            retain: true,
        });
    }
}
exports.onConnect = onConnect;
function subscribe(mqttClient) {
    const { homeAssistantIntegration, lights } = ConfigService_1.default.getInstance().getConfig();
    for (const light of lights) {
        // create array for topcis if not available
        if (!light.stateTopics) {
            light.stateTopics = [];
        }
        if (!light.setTopics) {
            light.setTopics = [];
        }
        // Add herb default topics
        light.stateTopics.push(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.light}/${light.sensorerId}/${IMqtt_1.Topic.state}`);
        light.setTopics.push(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.light}/${light.sensorerId}/${IMqtt_1.Topic.set}`);
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
exports.subscribe = subscribe;
function onMqttMessage(mqttClient, topic, message) {
    const { lights } = ConfigService_1.default.getInstance().getConfig();
    for (const light of lights) {
        // only go through set topics
        for (const setTopic of light.setTopics) {
            if (topic === setTopic) {
                const newState = Object.assign({ brightness: 204 }, JSON.parse(message));
                // publish to all channels via MQTT
                for (const stateTopic of light.stateTopics) {
                    mqttClient.publish(stateTopic, JSON.stringify(newState), {
                        retain: true,
                    });
                }
                // Set light leven via serial to hardware
                if (newState.state === "OFF") {
                    SerialService_1.default.getInstance().sendFastCommand(`setLight -light ${light.sensorerId.replace("light", "")} -level 0`);
                    continue;
                }
                SerialService_1.default.getInstance().sendFastCommand(`setLight -light ${light.sensorerId.replace("light", "")} -level ${newState.brightness}`);
            }
        }
    }
}
exports.onMqttMessage = onMqttMessage;
function onSerialMessage(message) {
}
exports.onSerialMessage = onSerialMessage;
//# sourceMappingURL=lights.js.map