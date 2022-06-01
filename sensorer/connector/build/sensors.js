"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onSerialMessage = exports.onMqttMessage = exports.subscribe = exports.onConnect = void 0;
const ConfigService_1 = __importDefault(require("./ConfigService"));
const IMqtt_1 = require("./IMqtt");
const SerialService_1 = require("./SerialService");
function onConnect(mqttClient) {
    const { homeAssistantIntegration, sensors } = ConfigService_1.default.getInstance().getConfig();
    // Register sensors to HomeAssistant if enabled
    if (homeAssistantIntegration) {
        for (const sensor of sensors) {
            let icon;
            switch (sensor.icon) {
                case "thermometer":
                    icon = "mdi:thermometer";
                    break;
                case "battery":
                    icon = "mdi:battery-80";
                    break;
            }
            mqttClient.publish(`homeassistant/sensor/${sensor.sensorerId}/config`, JSON.stringify({
                "~": `homeassistant/sensor/${sensor.sensorerId}`,
                "name": sensor.name,
                "unique_id": sensor.sensorerId,
                "stat_t": "~/state",
                "unit_of_measurement": sensor.unit_of_measurement,
                "icon": icon
            }));
        }
    }
    // Register sensors to herbiOs
    for (const sensor of sensors) {
        mqttClient.publish(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.sensor}/${sensor.sensorerId}/${IMqtt_1.Topic.config}`, JSON.stringify({
            "name": sensor.name,
            "unique_id": sensor.sensorerId,
            "unit_of_measurement": sensor.unit_of_measurement,
            "icon": sensor.icon,
        }), {
            retain: true,
        });
    }
}
exports.onConnect = onConnect;
function subscribe(mqttClient) {
    const { homeAssistantIntegration, sensors } = ConfigService_1.default.getInstance().getConfig();
    for (const sw of sensors) {
        // create array for topcis if not available
        if (!sw.stateTopics) {
            sw.stateTopics = [];
        }
        // Add herb default topics
        sw.stateTopics.push(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.sensor}/${sw.sensorerId}/${IMqtt_1.Topic.state}`);
        // add HomeAssistant topics if integration is enabled
        if (homeAssistantIntegration) {
            sw.stateTopics.push(`homeassistant/sensor/${sw.sensorerId}/state`);
        }
        // state topics
        mqttClient.subscribe(sw.stateTopics, function (err) {
            if (err) {
                console.log(`Error to subscribe ${JSON.stringify(sw.stateTopics)}`, err);
            }
        });
    }
}
exports.subscribe = subscribe;
function onMqttMessage(mqttClient, topic, message) {
}
exports.onMqttMessage = onMqttMessage;
function onSerialMessage(message, mqttClient) {
    const { sensors } = ConfigService_1.default.getInstance().getConfig();
    const [type, sensorData] = message.toString().split(SerialService_1.SerialStuff.delimiter);
    if (type === "sensors" && sensorData) {
        const sensor = sensorData.split(";");
        for (const sensorSet of sensor) {
            const [sensorId, value] = sensorSet.split("=");
            for (const sensor of sensors) {
                if (sensor.sensorerId === sensorId) {
                    for (const stateTopic of sensor.stateTopics) {
                        mqttClient.publish(stateTopic, value, {
                            retain: true,
                        });
                    }
                }
            }
        }
    }
}
exports.onSerialMessage = onSerialMessage;
//# sourceMappingURL=sensors.js.map