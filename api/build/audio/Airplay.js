"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigService_1 = __importDefault(require("../ConfigService"));
const AudioPlayer_1 = __importDefault(require("./AudioPlayer"));
const shairport_sync_reader_1 = __importDefault(require("shairport-sync-reader"));
const AudioService_1 = __importDefault(require("./AudioService"));
const fs_1 = __importDefault(require("fs"));
class Airplay extends AudioPlayer_1.default {
    constructor() {
        super("airplay", "airplay", "green");
        const shairportMetadata = ConfigService_1.default.getInstance().getConfig().airPlay;
        if (!fs_1.default.existsSync(shairportMetadata)) {
            console.log(`Could not load shairport feature. The path ${shairportMetadata} is not available`);
            return;
        }
        this._airplay = new shairport_sync_reader_1.default({ path: shairportMetadata });
        this._airplay.addListener("meta", (data) => {
            console.log("Airplay meta:", data);
            AudioService_1.default.getInstance().startPlayback("airplay");
            AudioService_1.default.getInstance().setPlayback({
                artist: data.asar,
                title: data.minm,
            });
        });
        // Playback starts
        this._airplay.addListener("pbeg", (data) => {
            console.log("Airplay pbeg:", data);
            AudioService_1.default.getInstance().startPlayback("airplay");
        });
        // Playback ends
        this._airplay.addListener("pend", (data) => {
            console.log("Airplay pend:", data);
            AudioService_1.default.getInstance().stop();
            AudioService_1.default.getInstance().startPlayback("EgoFM");
            AudioService_1.default.getInstance().stop();
        });
        this._airplay.addListener("client", (data) => console.log("Airplay client:", data));
        this._airplay.addListener("pfls", (data) => console.log("Airplay pfls", data));
        this._airplay.addListener("prgr", (data) => console.log("Airplay prgr", data));
        this._airplay.addListener("pvol", (data) => console.log("Airplay pvol", data));
        this._airplay.addListener("error", (data) => console.log("Airplay error", data));
    }
    play() {
    }
    pause() {
        this.stop();
    }
    stop() {
    }
}
exports.default = Airplay;
//# sourceMappingURL=Airplay.js.map