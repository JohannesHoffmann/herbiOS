export enum ClimateMode {
    off = "off",
    manual = "manual",
    temperature = "temperatureControl"
}

export enum HeaterMode {
    heat = "heat",
    fan = "fan",
    off = "off",
}

export enum FanMode {
    in = "in",
    out = "out",
    off = "off",
    inOut= "inOut",
}

export type HeaterStrength =  0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9


export interface IClimateConfig {
    humidity: number,
    temperature: number,
    heater: {
        mode: HeaterMode,
        strength: HeaterStrength;
    }
    fan: {
        mode: FanMode;
        strength: number;
    }
    mode: ClimateMode;
    temperatureControl: {
        temperature: number;
        hysteresisMax: number;
        hysteresisMin: number
    }
    ventilations: Array<{
        id: string;
        strength: number;
    }>
}