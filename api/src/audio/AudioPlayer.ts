import { AudioPlayerStatus } from "./AudioConfig";

export default abstract class AudioPlayer {

    private _state: AudioPlayerStatus = AudioPlayerStatus.stop; 


    public readonly name: string;
    public readonly artwork: string;
    public readonly _type: string;

    constructor(type: string, name: string, artwork: string) {
        this._type = type;
        this.name = name;
        this.artwork = artwork;
    }



    public play() {
        this._state = AudioPlayerStatus.play;
    }

    public pause() {
        this._state = AudioPlayerStatus.pause;
    }

    public stop() {
        this._state = AudioPlayerStatus.stop;
    }

    public get playing() {
        return this._state;
    }

    public get type() {
        return this._type;
    }
}