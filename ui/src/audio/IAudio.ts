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