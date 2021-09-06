import JsonConfig from "../api/file/JsonConfig";

export interface ISwitchesSwitchConfig {
    label: string;
    switchNumber: number;
    on: boolean;
}

// The hardware supports up to five lights
export interface ISwitchesConfig {
    switches: Array<ISwitchesSwitchConfig>;
}

export default class SwitchesConfig extends JsonConfig<ISwitchesConfig> {

    constructor() {
        super("switches.json");
        this._content = {
            switches: [
                {
                    label: "Switch 1",
                    switchNumber: 0,
                    on:  false,
                }
            ]
        }

        this.load();
    }

}