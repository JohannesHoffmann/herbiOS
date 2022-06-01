"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioPlayerStatus = void 0;
const JsonConfig_1 = __importDefault(require("../api/file/JsonConfig"));
var AudioPlayerStatus;
(function (AudioPlayerStatus) {
    AudioPlayerStatus["play"] = "play";
    AudioPlayerStatus["pause"] = "pause";
    AudioPlayerStatus["stop"] = "stop";
})(AudioPlayerStatus = exports.AudioPlayerStatus || (exports.AudioPlayerStatus = {}));
class AudioConfig extends JsonConfig_1.default {
    constructor() {
        super("audio.json");
        this._content = {
            volume: 50,
            playback: {
                type: "",
                name: "",
                state: AudioPlayerStatus.stop,
                playPosition: null,
                artwork: "",
            }
        };
        this.load();
    }
}
exports.default = AudioConfig;
//# sourceMappingURL=AudioConfig.js.map