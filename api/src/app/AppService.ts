import {CronJob} from "cron";
import ConfigService from "../ConfigService";
import GeoService from "../geo/GeoService";
import TelementryService from "../TelementryService";
import AppConfig, { VehicleModes } from "./AppConfig";


class AppService {

    private static instance: AppService;

    public static getInstance(): AppService {
        if (!AppService.instance) {
            AppService.instance = new AppService();
        }
        return AppService.instance;
    }

    private _job: CronJob;
    private _config: AppConfig;

    private constructor() {
        this._config = new AppConfig();
        this.setVehicleMode("tour");
    }

    setVehicleMode(mode: any) {
        console.log("Set vehicle mode to", mode);
            this._config.set({vehicleMode: mode}).save();

            if (this._job) {
                this._job.stop();
            }

            const cronInterval = ConfigService.getInstance().getConfig().modes.find(modeConfig => modeConfig.name === mode).cron;

            switch (mode) {
    
                case "parking":
                    // request server 
                    this._job = new CronJob(cronInterval, () => {
                        console.log("Parking Cronjob run", new Date());
                        GeoService.getInstance().getGeo();
                    });
                    break;

                case "tour":
                    console.log("Setup Cron tour with interval", cronInterval);
                    this._job = new CronJob(cronInterval, async () => {
                        console.log("Tour Cronjob run", new Date());
                        await GeoService.getInstance().getGeo();

                        await TelementryService.getInstance().transmit();
                    });
                    break;
    
                case "long-parking":
                    this._job = new CronJob(cronInterval, () => {
                        console.log("Long Term Parking Cronjob run", new Date());
                        GeoService.getInstance().getGeo();
                    });
                    break;
    
            }

            this._job.start();
    }

    getVehicleMode(): VehicleModes {
        return this._config.get().vehicleMode;
    }
}

export default AppService;