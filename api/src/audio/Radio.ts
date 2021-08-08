import {exec} from "child_process";
import ConfigService from "../ConfigService";
import AudioPlayer from "./AudioPlayer";

class Radio extends AudioPlayer {

    private _url: string;

    constructor(name: string, artwork: string, url: string) {
        super("radio", name, artwork);
        this._url = url;
    }

    public play() {
        super.play();
        console.log(`Starting playback of ${this.name}`);
        if (ConfigService.getInstance().config.env !== "development") {
            exec(`sh ${__dirname}/../../scripts/radioStart.sh ${this._url}`, (error, stdout, stderr) => {
                if (error) {
                  console.error(`exec error: ${error}`);
                  return;
                }
                console.log("Start Radio", stdout);
            });
        }
    }

    public pause() {
        this.stop();
    }

    public stop() {
        super.stop();
        console.log(`Stopping playback of ${this.name}`);
        if (ConfigService.getInstance().config.env !== "development") {
            exec(`sh ${__dirname}/../../scripts/radioStop.sh`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                console.log("Stop Radio", stdout);
            });
        }
    }

}

export default Radio;