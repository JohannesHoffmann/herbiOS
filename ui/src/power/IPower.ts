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