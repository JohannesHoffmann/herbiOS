import SerialService from "../SerialService";

export default class Ventilation {

    private _strength: number;
    private _id: string;

    constructor(id: string) {
        this._id = id;
    }

    public get id() {
        return this._id;
    }

    public get strength() {
        return this._strength;
    }


    public setStrength(strength: number) {
        this._strength = strength;
        SerialService.sendFastCommand("setFan -fan " + this._id + " -direction off -level " + this._strength);
    }

}