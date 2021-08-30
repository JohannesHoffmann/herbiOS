import { CurrentResponse, ThreeHourResponse } from "openweathermap-ts/dist/types";
import JsonConfig from "../api/file/JsonConfig";

export interface  IWeatherCurrent extends CurrentResponse {}
export interface  IWeatherForecast extends ThreeHourResponse{}

export interface IAroundMeConfig {
    currentWeather?: IWeatherCurrent;
    forecastWeather?: IWeatherForecast;
}

export default class AroundMeConfig extends JsonConfig<IAroundMeConfig> {

    constructor() {
        super("aroundMe.json");
        this._content = {
            
        }

        this.load();
    }

}