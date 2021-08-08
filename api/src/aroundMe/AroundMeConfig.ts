import { CurrentResponse } from "openweathermap-ts/dist/types";
import JsonConfig from "../api/file/JsonConfig";

export interface  IWeatherCurrent extends CurrentResponse {}

export interface IAroundMeConfig {
    currentWeather?: IWeatherCurrent;
}

export default class AroundMeConfig extends JsonConfig<IAroundMeConfig> {

    constructor() {
        super("aroundMe.json");
        this._content = {
            
        }

        this.load();
    }

}