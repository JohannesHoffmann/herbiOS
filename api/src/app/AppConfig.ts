import JsonConfig from "../api/file/JsonConfig";

export enum VehicleModes {
    tour = "tour",
    parking = "parking",
    longParking = "long-parking",
}

export interface IAppConfig {
    vehicleMode: VehicleModes;
}

export default class AppConfig extends JsonConfig<IAppConfig> {

    constructor() {
        super("app.json");
        this._content = {
            vehicleMode: VehicleModes.tour,
        }

        this.load();
    }

}