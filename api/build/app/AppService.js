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
const cron_1 = require("cron");
const ConfigService_1 = __importDefault(require("../ConfigService"));
const GeoService_1 = __importDefault(require("../geo/GeoService"));
const TelementryService_1 = __importDefault(require("../TelementryService"));
const AppConfig_1 = __importDefault(require("./AppConfig"));
class AppService {
    constructor() {
        this._config = new AppConfig_1.default();
        this.setVehicleMode("tour");
    }
    static getInstance() {
        if (!AppService.instance) {
            AppService.instance = new AppService();
        }
        return AppService.instance;
    }
    setVehicleMode(mode) {
        console.log("Set vehicle mode to", mode);
        this._config.set({ vehicleMode: mode }).save();
        if (this._job) {
            this._job.stop();
        }
        const cronInterval = ConfigService_1.default.getInstance().getConfig().modes.find(modeConfig => modeConfig.name === mode).cron;
        switch (mode) {
            case "parking":
                // request server 
                this._job = new cron_1.CronJob(cronInterval, () => {
                    console.log("Parking Cronjob run", new Date());
                    GeoService_1.default.getInstance().getGeo();
                });
                break;
            case "tour":
                console.log("Setup Cron tour with interval", cronInterval);
                this._job = new cron_1.CronJob(cronInterval, () => __awaiter(this, void 0, void 0, function* () {
                    console.log("Tour Cronjob run", new Date());
                    yield GeoService_1.default.getInstance().getGeo();
                    yield TelementryService_1.default.getInstance().transmit();
                }));
                break;
            case "long-parking":
                this._job = new cron_1.CronJob(cronInterval, () => {
                    console.log("Long Term Parking Cronjob run", new Date());
                    GeoService_1.default.getInstance().getGeo();
                });
                break;
        }
        this._job.start();
    }
    getVehicleMode() {
        return this._config.get().vehicleMode;
    }
}
exports.default = AppService;
//# sourceMappingURL=AppService.js.map