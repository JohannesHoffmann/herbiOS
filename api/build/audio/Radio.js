"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const ConfigService_1 = __importDefault(require("../ConfigService"));
const AudioPlayer_1 = __importDefault(require("./AudioPlayer"));
class Radio extends AudioPlayer_1.default {
    constructor(name, artwork, url) {
        super("radio", name, artwork);
        this._url = url;
    }
    play() {
        super.play();
        console.log(`Starting playback of ${this.name}`);
        if (ConfigService_1.default.getInstance().config.env !== "development") {
            child_process_1.exec(`sh ${__dirname}/../../scripts/radioStart.sh ${this._url}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                console.log("Start Radio", stdout);
            });
        }
    }
    pause() {
        this.stop();
    }
    stop() {
        super.stop();
        console.log(`Stopping playback of ${this.name}`);
        if (ConfigService_1.default.getInstance().config.env !== "development") {
            child_process_1.exec(`sh ${__dirname}/../../scripts/radioStop.sh`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                console.log("Stop Radio", stdout);
            });
        }
    }
}
exports.default = Radio;
//# sourceMappingURL=Radio.js.map