"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const geolib_1 = require("geolib");
const TouringService_1 = __importDefault(require("../touring/TouringService"));
const GeoModel_1 = __importDefault(require("./GeoModel"));
const MqttService_1 = __importDefault(require("../api/mqtt/MqttService"));
const IMqtt_1 = require("../api/mqtt/IMqtt");
class GeoService {
    constructor() {
        this._geoDistanceMin = 70; //  in meter; Is delta distance the code detects new position as movement and not as stay.
        this._geoDistanceMax = 600; //  in meter; Is delta distance the code detects new position as movement and not as stay.
    }
    static getInstance() {
        if (!GeoService.instance) {
            GeoService.instance = new GeoService();
        }
        return GeoService.instance;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this._modelGeoLog = GeoModel_1.default;
            // Listen to mqtt geo topic
            MqttService_1.default.getInstance().subscribe(`${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.geoPosition}/${IMqtt_1.Topic.state}`);
            MqttService_1.default.getInstance().onMessage((topic, message) => {
                if (topic === `${IMqtt_1.Topic.namespace}/${IMqtt_1.SubTopic.geoPosition}/${IMqtt_1.Topic.state}`) {
                    this._geoBefore = this._geo;
                    this._geo = JSON.parse(message.toString());
                    if (!this._geo || !this._geo.lat || !this._geo.lon) {
                        return;
                    }
                    if (!this._geoBefore) {
                        this.saveGeo();
                        return;
                    }
                    const distance = geolib_1.getDistance({
                        latitude: this._geo.lat, longitude: this._geo.lon
                    }, { latitude: this._geoBefore.lat, longitude: this._geoBefore.lon });
                    console.log("Distnce", distance, "to", this._geoDistanceMin);
                    if (distance > this._geoDistanceMin) {
                        this.saveGeo();
                    }
                }
            });
            yield this.getGeo();
        });
    }
    saveGeo() {
        return __awaiter(this, void 0, void 0, function* () {
            const activeTour = TouringService_1.default.getInstance().getActiveTour();
            const newEntry = this._modelGeoLog.build({
                lon: this._geo.lon,
                lat: this._geo.lat,
                speed: this._geo.speed,
                headingDeviation: this._geo.headingDeviation,
                altitude: this._geo.altitude,
                tourId: activeTour ? activeTour.id : null,
            });
            yield newEntry.save();
        });
    }
    getGeo() {
        return this._geo;
    }
    getLastPosition() {
        return this._geoBefore;
    }
}
exports.default = GeoService;
//# sourceMappingURL=GeoService.js.map