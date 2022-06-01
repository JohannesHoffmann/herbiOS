"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AudioConfig_1 = require("./AudioConfig");
class AudioPlayer {
    constructor(type, name, artwork) {
        this._state = AudioConfig_1.AudioPlayerStatus.stop;
        this._type = type;
        this.name = name;
        this.artwork = artwork;
    }
    play() {
        this._state = AudioConfig_1.AudioPlayerStatus.play;
    }
    pause() {
        this._state = AudioConfig_1.AudioPlayerStatus.pause;
    }
    stop() {
        this._state = AudioConfig_1.AudioPlayerStatus.stop;
    }
    get playing() {
        return this._state;
    }
    get type() {
        return this._type;
    }
}
exports.default = AudioPlayer;
//# sourceMappingURL=AudioPlayer.js.map