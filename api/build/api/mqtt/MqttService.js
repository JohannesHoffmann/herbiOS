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
const mqtt_1 = __importDefault(require("mqtt"));
const ConfigService_1 = __importDefault(require("../../ConfigService"));
/**
 * Service to manage mqtt subscriptions
 *
 * @class MqttService
 */
class MqttService {
    constructor() {
        this._subscriptionsBeforeConnected = [];
        this._config = ConfigService_1.default.getInstance().getConfig();
    }
    static getInstance() {
        if (!MqttService.instance) {
            MqttService.instance = new MqttService();
        }
        return MqttService.instance;
    }
    /**
     * initiate the mqtt client
     *
     * @memberof MqttService
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const port = this._config.mqtt.port ? this._config.mqtt.port : 1883;
            this._client = mqtt_1.default.connect(`mqtt://${this._config.mqtt.host}:${port}`, {
                username: this._config.mqtt.username,
                password: this._config.mqtt.password,
            });
            this._client.on('connect', () => {
                for (const subscribe of this._subscriptionsBeforeConnected) {
                    this.subscribe(subscribe);
                }
            });
        });
    }
    /**
     * Subscribe to a topic
     * @param topic
     */
    subscribe(topic) {
        if (!this._client.connected) {
            this._subscriptionsBeforeConnected = [
                ...this._subscriptionsBeforeConnected,
                ...Array.isArray(topic) ? topic : [topic],
            ];
            return;
        }
        this._client.subscribe(topic, function (err) {
            if (err) {
                console.log(`Error to subscribe ${topic}`, err);
            }
        });
    }
    /**
     * Unsubscribe to a topic
     * @param topic
     */
    unsubscribe(topic) {
        this._client.unsubscribe(topic, function (err) {
            if (err) {
                console.log(`Error to subscribe ${topic}`, err);
            }
        });
    }
    /**
     * callback for onMessage
     * @param callback
     */
    onMessage(callback) {
        this._client.on("message", callback);
    }
    /**
     * publish a topic change
     * @param callback
     */
    publish(topic, message) {
        this._client.publish(topic, message, {
            retain: true,
        });
    }
}
exports.default = MqttService;
//# sourceMappingURL=MqttService.js.map