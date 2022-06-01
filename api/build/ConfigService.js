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
            configurationDirectory: "data/",
            airPlay: "/tmp/shairport-sync-metadata",
            database: "sqlite:./data/db.sqlite",
            serial: {
                path: "/dev/ttyACM0",
                baud: 115200,
            },
            mqtt: {
                host: "localhost",
                port: 1883
            },
            rest: {
                port: 5555,
            },
            webSocket: {
                port: 5555,
            },
            groundControl: {
                url: "https://groundcontrol.tld",
            },
            modes: [
                {
                    name: "tour",
                    cron: "0 */5 * * * *",
                },
                {
                    name: "parking",
                    cron: "0 */30 * * * *",
                },
                {
                    name: "long-parking",
                    cron: "0 * */6 * * *",
                },
            ],
            authentication: {
                secret: "defaultSalt",
                expiration: "30d",
            },
            openWeatherApiKey: "Get your key on https://openweathermap.org/appid"
        };
        const configPath = Path.join(__dirname, `../`, this.config.configurationDirectory + "config.json");
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