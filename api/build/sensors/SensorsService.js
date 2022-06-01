"use strict";
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
const IMqtt_1 = require("../api/mqtt/IMqtt");
const MqttService_1 = __importDefault(require("../api/mqtt/MqttService"));
const ConfigService_1 = __importDefault(require("../ConfigService"));
const mqtt_match_1 = __importDefault(require("mqtt-match"));
class SensorsService {
    constructor() {
        this._config = ConfigService_1.default.getInstance().getConfig();
        this._data = [];
        this.init();
    }
    static getInstance() {
        if (!SensorsService.instance) {
            SensorsService.instance = new SensorsService();
        }
        return SensorsService.instance;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            // Register manual configured switches to mqtt auto discovery
            if (this._config.sensors) {
                const sensorsToRegister = this._config.sensors;
                for (const sensor of sensorsToRegister) {
                    MqttService_1.default.getInstance().publish(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.sensor}/${sensor.unique_id}/${IMqtt_1.Topic.config}`, JSON.stringify(sensor));
                }
            }
            MqttService_1.default.getInstance().onMessage((topic, message) => {
                if (mqtt_match_1.default(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.sensor}/+/${IMqtt_1.Topic.config}`, topic)) {
                    const config = JSON.parse(message.toString());
                    if (!this._data.find(s => s.unique_id === config.unique_id)) {
                        this._data.push(Object.assign(Object.assign({}, config), { changedAt: new Date(), value: 0 }));
                    }
                }
                if (mqtt_match_1.default(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.sensor}/+/${IMqtt_1.Topic.state}`, topic)) {
                    const value = message.toString();
                    const unique_id = topic.split("/")[2];
                    const index = this._data.findIndex(s => s.unique_id === unique_id);
                    if (index >= 0) {
                        // Track motion sensors only when true
                        if (unique_id.startsWith("motion") && value === "false")
                            return;
                        this._data[index].value = value;
                        this._data[index].changedAt = new Date();
                    }
                }
            });
        });
    }
    getSensorData() {
        return this._data;
    }
}
exports.default = SensorsService;
//# sourceMappingURL=SensorsService.js.map