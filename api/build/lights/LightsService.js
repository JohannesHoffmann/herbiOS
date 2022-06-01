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
class LightsService {
    constructor() {
        this._config = ConfigService_1.default.getInstance().getConfig();
        this.init();
    }
    static getInstance() {
        if (!LightsService.instance) {
            LightsService.instance = new LightsService();
        }
        return LightsService.instance;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            // Register manual configured lights to mqtt auto discovery
            if (this._config.lights) {
                const lightsToRegister = this._config.lights;
                for (const light of lightsToRegister) {
                    MqttService_1.default.getInstance().publish(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.light}/${light.unique_id}/${IMqtt_1.Topic.config}`, JSON.stringify(light));
                }
            }
        });
    }
}
exports.default = LightsService;
//# sourceMappingURL=LightsService.js.map