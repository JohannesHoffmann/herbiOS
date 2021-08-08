import JsonConfig from "../api/file/JsonConfig";

export enum AudioPlayerStatus {
    play = "play",
    pause = "pause",
    stop = "stop",
}

export interface IAudioConfig {
    volume: number;
    playback: {
        type: string;
        name: string;
        state: AudioPlayerStatus;
        playPosition: number | null; // number in seconds or null if it is a stream
        artwork: string;
        artist?: string;
        title?: string;
    };
}

export default class AudioConfig extends JsonConfig<IAudioConfig> {

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
        }

        this.load();
    }

}