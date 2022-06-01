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
const mqtt_1 = __importDefault(require("mqtt"));
const ConfigService_1 = __importDefault(require("./ConfigService"));
const Lights = __importStar(require("./lights"));
const Switches = __importStar(require("./switches"));
const Fans = __importStar(require("./fans"));
const Climates = __importStar(require("./climates"));
const GeoPosition = __importStar(require("./geoPosition"));
const Sensors = __importStar(require("./sensors"));
const Networking = __importStar(require("./networking"));
const SerialService_1 = __importDefault(require("./SerialService"));
const config = ConfigService_1.default.getInstance();
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    var client = mqtt_1.default.connect('mqtt://localhost:1883');
    client.on('message', function (topic, message) {
        Lights.onMqttMessage(client, topic, message.toString());
        Switches.onMqttMessage(client, topic, message.toString());
        Fans.onMqttMessage(client, topic, message.toString());
        Climates.onMqttMessage(client, topic, message.toString());
        Sensors.onMqttMessage(client, topic, message.toString());
        Networking.onMqttMessage(client, topic, message.toString());
    });
    client.on('connect', function () {
        Lights.onConnect(client);
        Switches.onConnect(client);
        Fans.onConnect(client);
        Climates.onConnect(client);
        GeoPosition.onConnect(client);
        Sensors.onConnect(client);
        Networking.onConnect(client);
        Lights.subscribe(client);
        Switches.subscribe(client);
        Fans.subscribe(client);
        Climates.subscribe(client);
        GeoPosition.subscribe(client);
        Sensors.subscribe(client);
        Networking.subscribe(client);
    });
    // Register listeners for Serial Port
    SerialService_1.default.getInstance().onMessage((message) => {
        Lights.onSerialMessage(message);
        Switches.onSerialMessage(message);
        Fans.onSerialMessage(message);
        Climates.onSerialMessage(message, client);
        GeoPosition.onSerialMessage(message, client);
        Sensors.onSerialMessage(message, client);
    });
});
start();
//# sourceMappingURL=app.js.map