import SocketService from "../api/websocket/SocketService";
import Airplay from "./Airplay";
import AudioConfig, { AudioPlayerStatus, IAudioConfig } from "./AudioConfig";
import AudioPlayer from "./AudioPlayer";
import AudioSocket from "./AudioSocket";
import Radio from "./Radio";
import Volume from "./Volume";

class AudioService {

    private static instance: AudioService;
    private _config: AudioConfig;
    private _socket: AudioSocket;
    private _volume: Volume;
    private _playback: AudioPlayer;
    private _players: Array<AudioPlayer> = [];

    public static getInstance(): AudioService {
        if (!AudioService.instance) {
         AudioService.instance = new AudioService();
        }
        return AudioService.instance;
    }

    private constructor() {
        this._config = new AudioConfig();
        this._socket = SocketService.getInstance().getNamespace("audio");
        this._volume= new Volume();

        this.setPlayer(new Radio("EgoFM", `url(herbi:///assets/egofm.jpg) no-repeat center center / cover`, "https://egofm-ais-edge-4008-fra-dtag-cdn.cast.addradio.de/egofm/live/mp3/high/stream.mp3"));
        this.setPlayer(new Airplay());
        // temporary here:
        this.startPlayback("EgoFM");
        this.pause();
    }

    setVolume(level: number) {
        this._volume.set(level);
        this._config.set({
            volume: level,
        });
        this._config.save();
        this._update();
    }

    setPlayer(player: AudioPlayer) {
        const foundIndex = this._players.findIndex(item => item.name === player.name);
        if (foundIndex < 0) {
            this._players.push(player);
        }
    }

    getPlayers() {
        this._players;
    }

    private _update() {
        this._socket.updateStatus(this._config.get());
    }

    public async startPlayback(playerName: string) {
        const player = this._players.find(item => item.name === playerName);
        if (player) {
            if (this._playback) {
                this._playback.stop();
            }
            this._playback
            this._playback = player;
            this._playback.play();

            this._config.set({
                playback: {
                    type: player.type,
                    name: player.name,
                    state: AudioPlayerStatus.play,
                    playPosition: 0,
                    artwork: this._playback.artwork,
                }
            });
            this._config.save();
            this._update();
        } else {
            throw new Error("Player not found");
        }
    }

    public play() {
        if (this._playback) {
            this._playback.play();
            this._config.set({
                playback: {
                    ...this._config.get().playback,
                    state: AudioPlayerStatus.play,
                }
            });
            this._config.save();
            this._update();
        }
    }

    public pause() {
        if (this._playback) {
            this._playback.pause();
            this._config.set({
                playback: {
                    ...this._config.get().playback,
                    state: AudioPlayerStatus.pause,
                }
            });
            this._config.save();
            this._update();
        }
    }

    public stop() {
        if (this._playback) {
            this._playback.stop();
            this._config.set({
                playback: {
                    ...this._config.get().playback,
                    state: AudioPlayerStatus.stop,
                    artist: undefined,
                    title: undefined,
                }
            });
            this._config.save();
            this._update();
        }
    }

    public setPlayback(song: {artist: IAudioConfig["playback"]["artist"], title:IAudioConfig["playback"]["title"] }) {
        this._config.set({
            playback: {
                ...this._config.get().playback,
                artist: song.artist,
                title: song.title,
            }
        })
        this._update();
    }

    public getPlayback() {
        if (this._playback) {
            this._playback;
        }
    }

    public getConfig(): IAudioConfig {
        return this._config.get();
    }

}

export default AudioService;