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
function onConnect(mqttClient) {
    const { geoPosition } = ConfigService_1.default.getInstance().getConfig();
    // create array for topcis if not available
    if (!geoPosition.state_topics) {
        geoPosition.state_topics = [];
    }
    // Add herbi default topics
    geoPosition.state_topics.push(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.geoPosition}/${IMqtt_1.Topic.state}`);
    setInterval(() => {
        SerialService_1.default.getInstance().sendFastCommand("getPosition");
    }, 60 * 1000);
}
exports.onConnect = onConnect;
function subscribe(mqttClient) {
}
exports.subscribe = subscribe;
function onMqttMessage(mqttClient, topic, message) {
}
exports.onMqttMessage = onMqttMessage;
function onSerialMessage(message, mqttClient) {
    const [type, value] = message.toString().split(SerialService_1.SerialStuff.delimiter);
    const { geoPosition } = ConfigService_1.default.getInstance().getConfig();
    if (type === "geoPosition") {
        const dataArray = value.split(",");
        if (dataArray.length >= 4 && Number(dataArray[2]) < 10000000 && Number(dataArray[3]) < 10000000) {
            return;
        }
        const [status, dateTime, lat, lon, headingDeviation, speed, altitude, satellites] = dataArray;
        const newGeo = {
            status: Number(status),
            dateTime: new Date(dateTime),
            lat: Number(lat) / 10000000,
            lon: Number(lon) / 10000000,
            headingDeviation,
            speed: Number(speed),
            altitude: Number(altitude),
            satellites: Number(satellites),
        };
        if (!lat || !lon) {
            console.log("Geo not ok", newGeo);
            return;
        }
        console.log("Geo ok", newGeo);
        for (const stateTopic of geoPosition.state_topics) {
            mqttClient.publish(stateTopic, JSON.stringify(newGeo), {
                retain: true,
            });
        }
    }
}
exports.onSerialMessage = onSerialMessage;
//# sourceMappingURL=geoPosition.js.map