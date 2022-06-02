import { getDistance } from "geolib";
import TouringService from "../touring/TouringService";
import { IGeo } from "./IGeo";
import GeoLog from "./GeoModel";
import MqttService from "../api/mqtt/MqttService";
import { SubTopic, Topic } from "../api/mqtt/IMqtt";

class GeoService {

    private static instance: GeoService;

    public static getInstance(): GeoService {
        if (!GeoService.instance) {
         GeoService.instance = new GeoService();
        }
        return GeoService.instance;
    }

    private readonly _geoDistanceMin: Number = 70; //  in meter; Is delta distance the code detects new position as movement and not as stay.
    private readonly _geoDistanceMax: Number = 600; //  in meter; Is delta distance the code detects new position as movement and not as stay.

    private _geo: IGeo;
    private _geoBefore: IGeo;
    private _modelGeoLog: typeof GeoLog;

    private constructor() {
    }

    public async init() {
        this._modelGeoLog = GeoLog;

        // Listen to mqtt geo topic
        MqttService.getInstance().subscribe(`${Topic.namespace}/${SubTopic.geoPosition}/${Topic.state}`);
        MqttService.getInstance().onMessage((topic, message) => {
            if (topic === `${Topic.namespace}/${SubTopic.geoPosition}/${Topic.state}`) {
                this._geoBefore = this._geo;
                this._geo = JSON.parse(message.toString());

                if (!this._geo || !this._geo.lat || !this._geo.lon ) {
                    return;
                }

                if (!this._geoBefore) {
                    this.saveGeo();
                    return;
                }

                const distance = getDistance(
                    { latitude: this._geo.lat, longitude: this._geo.lon},
                    { latitude: this._geoBefore.lat, longitude: this._geoBefore.lon }
                );
                
                
                if (distance > this._geoDistanceMin) {
                    this.saveGeo();
                }
            }
        })

        await this.getGeo();
    }

    private async saveGeo() {
        const activeTour = TouringService.getInstance().getActiveTour();
        const newEntry = this._modelGeoLog.build({
            lon: this._geo.lon,
            lat: this._geo.lat,
            speed: this._geo.speed,
            headingDeviation: this._geo.headingDeviation,
            altitude: this._geo.altitude,
            tourId: activeTour ? activeTour.id : null,
        });
        await newEntry.save();
    }

    public getGeo(): IGeo {
        return this._geo;
    }


    public getLastPosition(): IGeo {
        return this._geoBefore;
    }

}

export default GeoService;