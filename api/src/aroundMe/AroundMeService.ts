import SocketService from "../api/websocket/SocketService";
import AroundMeConfig, { IAroundMeConfig } from "./AroundMeConfig";
import OpenWeatherMap from 'openweathermap-ts';
import GeoService from "../geo/GeoService";
import AroundMeSocket from "./AroundMeSocket";
import { CronJob } from "cron";

class AroundMeService {

    private static instance: AroundMeService;
    private _config: AroundMeConfig;
    private _weather: OpenWeatherMap;
    private _socket: AroundMeSocket;
    private _cronJob: CronJob;
    private _cronJobInterval: string = "0 */5 * * * *"; // updates the arround me data every 30 minutes

    public static getInstance(): AroundMeService {
        if (!AroundMeService.instance) {
         AroundMeService.instance = new AroundMeService();
        }
        return AroundMeService.instance;
    }

    private constructor() {
        this._config = new AroundMeConfig();
        this._socket = SocketService.getInstance().getNamespace("aroundMe");

        this._weather = new OpenWeatherMap({
            apiKey: 'myOpenWeatherApiKey',
            units: "metric",
            language: "de",
          });

        // Setup a Cron to update around me data
        this._cronJob = new CronJob(this._cronJobInterval, () => {
            this.updateAroundMeData();
        });
        this._cronJob.start();
    } 

    private _update() {
        this._socket.updateStatus(this._config.get());
    }
    
    public async updateAroundMeData() {
        console.log("Update Around Me Data")
        await this.fetchWeather();
    }


    /**
     * Fetches weather data from the internet
     *
     * @memberof AroundMeService
     */
    public async fetchWeather() {
        try {
            const cords = GeoService.getInstance().getLastPosition();
            const currentWeather = await this._weather.getCurrentWeatherByGeoCoordinates(cords.lat, cords.lon);
            console.log("Current Weather in ", cords);
            this._config.set({
                currentWeather,
            });
            this._config.save();
            this._update();
        } catch (e) {
            console.log("Could not update weather.", e.message);
        }
    }

    public getConfig(): IAroundMeConfig {
        return this._config.get();
    }

}

export default AroundMeService;