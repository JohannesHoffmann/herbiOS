import JsonConfig from "../api/file/JsonConfig";

export interface ILightsLightConfig {
    label: string;
    level: number;
}

// The hardware supports up to five lights
export interface ILightsConfig {
    lights: {
        light1: ILightsLightConfig; // One light must be set
        light2?: ILightsLightConfig;
        light3?: ILightsLightConfig;
        light4?: ILightsLightConfig;
        light5?: ILightsLightConfig;
    };
}

export default class LightsConfig extends JsonConfig<ILightsConfig> {

    constructor() {
        super("lights.json");
        this._content = {
            lights: {
                light1: {
                    label: "Light 1",
                    level: 0
                }
            }
        }

        this.load();
    }

}