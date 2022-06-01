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
Object.defineProperty(exports, "__esModule", { value: true });
const Path = __importStar(require("path"));
const Fs = __importStar(require("fs"));
class ConfigService {
    constructor() {
        this.config = {
            env: "development",
            homeAssistantIntegration: true,
            serial: {
                path: "/dev/cu.usbmodem",
                baud: 115200,
            },
            lights: [
                {
                    name: "Main Light",
                    brightness: true,
                    sensorerId: "light1",
                }
            ],
            switches: [
                {
                    name: "Power Switch",
                    sensorerId: 1,
                }
            ],
            fans: [
                {
                    name: "Cabin Fan",
                    sensorerId: "overhead",
                }
            ],
            climates: [
                {
                    name: "Heater",
                    sensorerId: "heater",
                }
            ],
            geoPosition: {
                state_topics: [],
            },
            sensors: [
                {
                    name: "Room temperature",
                    sensorerId: "temperature1",
                    icon: "thermometer"
                }
            ],
            networking: {
                modems: [],
                interfaces: [],
            },
        };
        const configPath = Path.join(__dirname, `../data/`, "config.json");
        if (Fs.existsSync(configPath)) {
            const loadedConfig = Fs.readFileSync(configPath, { encoding: "utf-8" });
            this.config = Object.assign(Object.assign({}, this.config), JSON.parse(loadedConfig));
        }
        else {
            Fs.writeFileSync(configPath, JSON.stringify(this.config, null, 4));
        }
    }
    static getInstance() {
        if (!ConfigService.instance) {
            ConfigService.instance = new ConfigService();
        }
        return ConfigService.instance;
    }
    getConfig() {
        return this.config;
    }
}
exports.default = ConfigService;
//# sourceMappingURL=ConfigService.js.map