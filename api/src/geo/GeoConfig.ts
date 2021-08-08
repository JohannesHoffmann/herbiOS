import JsonConfig from "../api/file/JsonConfig";

export interface IGeo {
    status: number,
    dateTime: Date,
    lat: number,
    lon: number,
    headingDeviation: string,
    speed: number,
    altitude: number,
    satellites: number,
}


export interface IGeoConfig {
    current: IGeo;
}

export default class GeoConfig extends JsonConfig<IGeoConfig> {

    constructor() {
        super("geo.json");
        this._content = {
            current: {
                status: 0,
                dateTime: new Date(),
                lat: 0,
                lon: 0,
                headingDeviation: "",
                speed: 0,
                altitude: 0,
                satellites: 0,
            }
        }

        this.load();
    }

}