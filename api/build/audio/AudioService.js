"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const SocketService_1 = __importDefault(require("../api/websocket/SocketService"));
const Airplay_1 = __importDefault(require("./Airplay"));
const AudioConfig_1 = __importStar(require("./AudioConfig"));
const Radio_1 = __importDefault(require("./Radio"));
const Volume_1 = __importDefault(require("./Volume"));
class AudioService {
    constructor() {
        this._players = [];
        this._config = new AudioConfig_1.default();
        this._socket = SocketService_1.default.getInstance().getNamespace("audio");
        this._volume = new Volume_1.default();
        this.setPlayer(new Radio_1.default("EgoFM", `url(herbi:///assets/egofm.jpg) no-repeat center center / cover`, "https://egofm-ais-edge-4008-fra-dtag-cdn.cast.addradio.de/egofm/live/mp3/high/stream.mp3"));
        this.setPlayer(new Airplay_1.default());
        // temporary here:
        this.startPlayback("EgoFM");
        this.pause();
    }
    static getInstance() {
        if (!AudioService.instance) {
            AudioService.instance = new AudioService();
        }
        return AudioService.instance;
    }
    setVolume(level) {
        this._volume.set(level);
        this._config.set({
            volume: level,
        });
        this._config.save();
        this._update();
    }
    setPlayer(player) {
        const foundIndex = this._players.findIndex(item => item.name === player.name);
        if (foundIndex < 0) {
            this._players.push(player);
        }
    }
    getPlayers() {
        this._players;
    }
    _update() {
        this._socket.updateStatus(this._config.get());
    }
    startPlayback(playerName) {
        return __awaiter(this, void 0, void 0, function* () {
            const player = this._players.find(item => item.name === playerName);
            if (player) {
                if (this._playback) {
                    this._playback.stop();
                }
                this._playback;
                this._playback = player;
                this._playback.play();
                this._config.set({
                    playback: {
                        type: player.type,
                        name: player.name,
                        state: AudioConfig_1.AudioPlayerStatus.play,
                        playPosition: 0,
                        artwork: this._playback.artwork,
                    }
                });
                this._config.save();
                this._update();
            }
            else {
                throw new Error("Player not found");
            }
        });
    }
    play() {
        if (this._playback) {
            this._playback.play();
            this._config.set({
                playback: Object.assign(Object.assign({}, this._config.get().playback), { state: AudioConfig_1.AudioPlayerStatus.play })
            });
            this._config.save();
            this._update();
        }
    }
    pause() {
        if (this._playback) {
            this._playback.pause();
            this._config.set({
                playback: Object.assign(Object.assign({}, this._config.get().playback), { state: AudioConfig_1.AudioPlayerStatus.pause })
            });
            this._config.save();
            this._update();
        }
    }
    stop() {
        if (this._playback) {
            this._playback.stop();
            this._config.set({
                playback: Object.assign(Object.assign({}, this._config.get().playback), { state: AudioConfig_1.AudioPlayerStatus.stop, artist: undefined, title: undefined })
            });
            this._config.save();
            this._update();
        }
    }
    setPlayback(song) {
        this._config.set({
            playback: Object.assign(Object.assign({}, this._config.get().playback), { artist: song.artist, title: song.title })
        });
        this._update();
    }
    getPlayback() {
        if (this._playback) {
            this._playback;
        }
    }
    getConfig() {
        return this._config.get();
    }
}
exports.default = AudioService;
//# sourceMappingURL=AudioService.js.map