import NamespaceSocket from "../api/websocket/NamespaceSocket";
import { Socket, Server} from "socket.io";
import { AudioPlayerStatus, IAudioConfig } from "./AudioConfig";
import AudioService from "./AudioService";

 type  AudioEventsListen = {
     ["status"]: () => void,
     ["playback:change"]: (set: {name: string}) => void,
     ["volume:change"]: (set: {level: number}) => void,
     ["play:change"]: (set: {play: AudioPlayerStatus}) => void,
    }
    
    type  AudioEventsEmit = {
     ["status"]: (status: IAudioConfig) => void,
 }

/**
 * Class to send herp system events over the socket server under the /events namespace
 *
 * @export
 * @class LightsSocket
 * @extends {NamespaceSocket}
 */
export default class AudioSocket extends NamespaceSocket {

    constructor(ws: Server<AudioEventsListen, AudioEventsEmit>) {
        super(ws, "/audio");
    }

    protected _socket(socket: Socket<AudioEventsListen, AudioEventsEmit>) {
        socket.emit("status", AudioService.getInstance().getConfig());

        // Request lights
        socket.on("status", () => {
            socket.emit("status", AudioService.getInstance().getConfig());
        });

        // Request heater settings for manual
        socket.on("playback:change", (message) => {
            AudioService.getInstance().startPlayback(message.name);
        });
        
        // Request heater settings for manual
        socket.on("play:change", (message) => {
            switch (message.play) {
                case AudioPlayerStatus.pause:
                    AudioService.getInstance().pause();
                    break;
                case AudioPlayerStatus.stop:
                    AudioService.getInstance().stop();
                    break;
                case AudioPlayerStatus.play:
                    AudioService.getInstance().play();
                    break;
            }
        });

        // Request lights
        socket.on("volume:change", (message) => {
            AudioService.getInstance().setVolume(message.level);
        });
    }

    public updateStatus(status: IAudioConfig) {
        this._ws.emit("status", status);
    }
}