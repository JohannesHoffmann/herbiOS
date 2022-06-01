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
const SocketService_1 = __importDefault(require("../api/websocket/SocketService"));
const AroundMeConfig_1 = __importDefault(require("./AroundMeConfig"));
const openweathermap_ts_1 = __importDefault(require("openweathermap-ts"));
const GeoService_1 = __importDefault(require("../geo/GeoService"));
const cron_1 = require("cron");
const ConfigService_1 = __importDefault(require("../ConfigService"));
class AroundMeService {
    constructor() {
        this._cronJobInterval = "0 */5 * * * *"; // updates the around me data every 30 minutes
        this._config = new AroundMeConfig_1.default();
        this._socket = SocketService_1.default.getInstance().getNamespace("aroundMe");
        const apiKey = ConfigService_1.default.getInstance().getConfig().openWeatherApiKey;
        this._weather = new openweathermap_ts_1.default({
            apiKey,
            units: "metric",
            language: "de",
        });
        // Setup a Cron to update around me data
        this._cronJob = new cron_1.CronJob(this._cronJobInterval, () => {
            this.updateAroundMeData();
        });
        this._cronJob.start();
    }
    static getInstance() {
        if (!AroundMeService.instance) {
            AroundMeService.instance = new AroundMeService();
        }
        return AroundMeService.instance;
    }
    _update() {
        this._socket.updateStatus(this._config.get());
    }
    updateAroundMeData() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.fetchWeather();
        });
    }
    /**
     * Fetches weather data from the internet
     *
     * @memberof AroundMeService
     */
    fetchWeather() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cords = GeoService_1.default.getInstance().getLastPosition();
                const currentWeather = yield this._weather.getCurrentWeatherByGeoCoordinates(cords.lat, cords.lon);
                const forecastWeather = yield this._weather.getThreeHourForecastByGeoCoordinates(cords.lat, cords.lon);
                this._config.set({
                    currentWeather,
                    forecastWeather,
                });
                this._config.save();
                this._update();
            }
            catch (e) {
                console.log("Could not update weather.", e.message);
            }
        });
    }
    getConfig() {
        return this._config.get();
    }
}
exports.default = AroundMeService;
//# sourceMappingURL=AroundMeService.js.map