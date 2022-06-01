"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NamespaceSocket_1 = __importDefault(require("../api/websocket/NamespaceSocket"));
const AudioConfig_1 = require("./AudioConfig");
const AudioService_1 = __importDefault(require("./AudioService"));
/**
 * Class to send herp system events over the socket server under the /events namespace
 *
 * @export
 * @class LightsSocket
 * @extends {NamespaceSocket}
 */
class AudioSocket extends NamespaceSocket_1.default {
    constructor(ws) {
        super(ws, "/audio");
    }
    _socket(socket) {
        socket.emit("status", AudioService_1.default.getInstance().getConfig());
        // Request lights
        socket.on("status", () => {
            socket.emit("status", AudioService_1.default.getInstance().getConfig());
        });
        // Request heater settings for manual
        socket.on("playback:change", (message) => {
            AudioService_1.default.getInstance().startPlayback(message.name);
        });
        // Request heater settings for manual
        socket.on("play:change", (message) => {
            switch (message.play) {
                case AudioConfig_1.AudioPlayerStatus.pause:
                    AudioService_1.default.getInstance().pause();
                    break;
                case AudioConfig_1.AudioPlayerStatus.stop:
                    AudioService_1.default.getInstance().stop();
                    break;
                case AudioConfig_1.AudioPlayerStatus.play:
                    AudioService_1.default.getInstance().play();
                    break;
            }
        });
        // Request lights
        socket.on("volume:change", (message) => {
            AudioService_1.default.getInstance().setVolume(message.level);
        });
    }
    updateStatus(status) {
        this._ws.emit("status", status);
    }
}
exports.default = AudioSocket;
//# sourceMappingURL=AudioSocket.js.map