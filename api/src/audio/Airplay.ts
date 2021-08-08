import {exec} from "child_process";
import ConfigService from "../ConfigService";
import AudioPlayer from "./AudioPlayer";
import ShairportReader from "shairport-sync-reader";
import AudioService from "./AudioService";

class Airplay extends AudioPlayer {

    private _airplay: ShairportReader;

    constructor() {
        super("airplay", "airplay", "green");
        this._airplay = new ShairportReader({ path: ConfigService.getInstance().getConfig().airPlay});
        this._airplay.addListener("meta", (data) => {
            console.log("Airplay meta:", data)
            AudioService.getInstance().startPlayback("airplay");
            AudioService.getInstance().setPlayback({
                artist: data.asar,
                title: data.minm,
            })
        });
        // Playback starts
        this._airplay.addListener("pbeg", (data) => {
            console.log("Airplay pbeg:", data)
            AudioService.getInstance().startPlayback("airplay");
        });
        // Playback ends
        this._airplay.addListener("pend", (data) => {
            console.log("Airplay pend:", data);
            AudioService.getInstance().stop();
            AudioService.getInstance().startPlayback("EgoFM");
            AudioService.getInstance().stop();
        });
        this._airplay.addListener("client", (data) => console.log("Airplay client:", data))
        this._airplay.addListener("pfls", (data) => console.log("Airplay pfls", data))
        this._airplay.addListener("prgr", (data) => console.log("Airplay prgr", data))
        this._airplay.addListener("pvol", (data) => console.log("Airplay pvol", data))
        this._airplay.addListener("error", (data) => console.log("Airplay error", data))
    }

    public play() {
        
    }

    public pause() {
        this.stop();
    }

    public stop() {
        
    }

}

export default Airplay;