import JsonConfig from "../api/file/JsonConfig";
import { FanMode } from "./Fan";
import { HeaterMode, HeaterStrength } from "./Heater";

export enum ClimateMode {
    off = "off",
    manual = "manual",
    temperature = "temperatureControl"
}

export interface IClimateConfig {
    humidity: number,
    temperature: number,
    heater: {
        mode: HeaterMode,
        strength: HeaterStrength;
    }
    mode: ClimateMode;
    temperatureControl: {
        temperature: number;
        hysteresisMax: number;
        hysteresisMin: number
    }
    fan: {
        mode: FanMode;
        strength: number;
    },
    ventilations: Array<{
        id: string;
        strength: number;
    }>,
    // setFan -fan fan1 -level 255 <-- cabin
    // setFan -fan fan2 -level 255 <-- electric
}

export default class ClimateConfig extends JsonConfig<IClimateConfig> {

    constructor() {
        super("climate.json");
        this._content = {
            humidity: 0,
            temperature: 15,
            heater: {
                mode: HeaterMode.off,
                strength: 0,
            },
            mode: ClimateMode.manual,
            temperatureControl: {
                temperature: 15,
                hysteresisMax: 3,
                hysteresisMin: 5,
            },
            fan: {
                mode: FanMode.off,
                strength: 0,
            },
            ventilations: [],
        }

        this.load();
    }

}