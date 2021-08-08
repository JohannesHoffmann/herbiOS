import JsonConfig from "../api/file/JsonConfig";

export enum SolarMode {
    serial = "serial",
    parallel = "parallel",
    off = "off"
}

export interface IPowerSolarLog {
    time: Date;
    volt: number;
    watt: number;
    ampere: number;
    mode:SolarMode;
}

export interface IPowerConfig {
    solar: SolarMode;
    batteryVolt: number;
    switches: {
        inverter: boolean;
        water: boolean;
        chiller: boolean;
    };
    settings: {
        batteryVoltMax: number;
        batteryVoltMin: number;
    }
    solarLastLog: IPowerSolarLog;
}

export default class PowerConfig extends JsonConfig<IPowerConfig> {

    constructor() {
        super("power.json");
        this._content = {
            solar: SolarMode.parallel,
            batteryVolt: 130,
            switches: {
                inverter: false,
                water: true,
                chiller: true,
            },
            settings: {
                batteryVoltMax: 138,
                batteryVoltMin: 105,
            },
            solarLastLog: {
                time: new Date(),
                volt: 135,
                watt: 65,
                ampere: 4,
                mode: SolarMode.parallel,
            }
        }

        this.load();
    }

}