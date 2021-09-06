import SerialService from "../SerialService";

export enum HeaterMode {
    heat = "heat",
    fan = "fan",
    off = "off",
}

export type HeaterStrength =  0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export default class Heater {

    private _mode: HeaterMode = HeaterMode.off;
    private _strength: HeaterStrength = 0;

    public get mode() {
        return this._mode;
    }

    public get strength() {
        return this._strength;
    }

    public setMode(mode: HeaterMode) {
        this._mode = mode;

        switch (mode) {
            case "off":
                SerialService.sendFastCommand("heater -do stop");
                break;
            case "fan":
                SerialService.sendFastCommand("heater -do fan" + this._strength);
                break;
            case "heat":
                SerialService.sendFastCommand("heater -do heat" + this._strength);
                break;
        }
    }

    public setStrength(strength: HeaterStrength) {
        this._strength = strength;
        this.setMode(this._mode);
    }

}