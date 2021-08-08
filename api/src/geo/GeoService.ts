import { getDistance } from "geolib";
import SocketService from "../api/websocket/SocketService";
import DatabaseService from "../DatabaseService";
import SerialService from "../SerialService";
import GeoConfig, { IGeo, IGeoConfig } from "./GeoConfig";
import GeoLog from "./GeoModel";
import GeoSocket from "./GeoSocket";

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
    private _config: GeoConfig;
    private _socket: GeoSocket;
    private _geo: IGeo;
    private _modelGeoLog: typeof GeoLog;

    private constructor() {
    }

    public async init() {
        this._modelGeoLog = GeoLog;
        this._config = new GeoConfig();
        this._socket = SocketService.getInstance().getNamespace("geo");
        this._geo = this._config.get().current;
        await this.getGeo();
    }


    async _renewGeo() {
        const position = await SerialService.sendAndRead("getPosition");
        console.log("GEO: got geo position from arduino", position);
        const dataArray = position.split(",");
        if (dataArray.length >= 4 && Number(dataArray[2]) < 10000000 && Number(dataArray[3]) < 10000000) {
            return;
        }
        const [status, dateTime, lat, lon, headingDeviation, speed, altitude, satellites] = dataArray;
        const newGeo = {
            status: Number(status),
            dateTime: new Date(dateTime),
            lat: Number(lat) / 10000000,
            lon: Number(lon) / 10000000,
            headingDeviation,
            speed: Number(speed),
            altitude: Number(altitude),
            satellites: Number(satellites),
        };

        if (!lat|| !lon) {
            console.log("Geo not ok", newGeo);
            return;
        }

        console.log("Geo ok", newGeo);

        // Save geo position to database
        const saveGeo = async () => {
            this._geo = newGeo;

            const newEntry = this._modelGeoLog.build({
                lon: this._geo.lon,
                lat: this._geo.lat,
                speed: this._geo.speed,
                headingDeviation: this._geo.headingDeviation,
                altitude: this._geo.altitude,
            });
            await newEntry.save();
        }

        if (!this._geo) {
            saveGeo();
        }

        const distance = getDistance({
            latitude: newGeo.lat, longitude: newGeo.lon},
            { latitude: this._geo.lat, longitude: this._geo.lon });
        
        if (distance > this._geoDistanceMin) {
            saveGeo();
        }
    }


    public async getGeo(): Promise<IGeo> {
        await this._renewGeo();
        this._config.set({
            current: this._geo
        });
        this._config.save();
        this._update();
        return this._geo;
    }


    public getLastPosition(): IGeo {
        return this._geo;
    }

    public getConfig(): IGeoConfig {
        return this._config.get();
    }

    private _update() {
        this._socket.updateStatus(this._config.get());
    }

}

export default GeoService;