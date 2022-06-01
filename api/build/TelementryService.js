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
const axios_1 = __importDefault(require("axios"));
const ConfigService_1 = __importDefault(require("./ConfigService"));
const GeoService_1 = __importDefault(require("./geo/GeoService"));
const RestService_1 = __importDefault(require("./RestService"));
const SensorsService_1 = __importDefault(require("./sensors/SensorsService"));
class TelemetryService {
    constructor() {
    }
    static getInstance() {
        if (!TelemetryService.instance) {
            TelemetryService.instance = new TelemetryService();
        }
        return TelemetryService.instance;
    }
    _sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    transmit() {
        return __awaiter(this, void 0, void 0, function* () {
            // DO TRANSMISSION STUFF
            let dataPackage = {
                position: GeoService_1.default.getInstance().getLastPosition(),
                sensors: SensorsService_1.default.getInstance().getSensorData(),
            };
            console.log("Telemetry data ", dataPackage);
            const token = RestService_1.default.getInstance().server.jwt.sign({ type: "van", name: "herbi" });
            try {
                yield axios_1.default.post(ConfigService_1.default.getInstance().config.groundControl.url + "/telemetry", dataPackage, {
                    headers: {
                        "Authorization": "Bearer " + token,
                    }
                });
            }
            catch (e) {
                console.log("Could not transmit telemetry data");
            }
            // END OF DOING TRANSMISSION STUFF
        });
    }
}
exports.default = TelemetryService;
//# sourceMappingURL=TelementryService.js.map