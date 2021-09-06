import JsonConfig from "../api/file/JsonConfig";

export interface ILightsLightConfig {
    label: string;
    lightNumber: number;
    level: number;
}

// The hardware supports up to five lights
export interface ILightsConfig {
    lights: Array<ILightsLightConfig>;
}

export default class LightsConfig extends JsonConfig<ILightsConfig> {

    constructor() {
        super("lights.json");
        this._content = {
            lights: [
                {
                    label: "Light 1",
                    lightNumber: 0,
                    level: 0,
                }
            ]
        }

        this.load();
    }

}