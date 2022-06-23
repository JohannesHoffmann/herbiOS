import React from 'react';
import { createContainer } from 'react-tracked';
import { socketSend, useWebSocket } from '../utils/useWebSocket';
import { AudioPlayerStatus, IAudioConfig } from './IAudio';
import { cloneDeep } from "lodash";

type Actions = {
    type: "PLAYBACK";
    name: string;
} | {
    type: "SET";
    config: Partial<IAudioState>;
} | {
    type: "VOLUME";
    level: number;
} | {
    type: "PAUSE";
} | {
    type: "STOP";
} | {
    type: "PLAY";
};

export interface IAudioState extends IAudioConfig {

}

let audioState: IAudioState = {
    volume: 50,
    playback: {
        type: "",
        name: "",
        state: AudioPlayerStatus.stop,
        playPosition: null,
        artwork: "",
    }
}

const reducer = (state: IAudioState , action: Actions) => {
    let newState: IAudioState = cloneDeep(state);

    switch (action.type) {
        case "SET":
            newState = {
                ...newState,
                ...action.config,
            }
            break;

        case "VOLUME":
            newState.volume = action.level;
            socketSend("volume:change", "/audio")({level: action.level});
            break;

        case "PLAY":
            newState.playback.state = AudioPlayerStatus.play;
            socketSend("play:change", "/audio")({play: AudioPlayerStatus.play});
            break;
        case "PAUSE":
            newState.playback.state = AudioPlayerStatus.pause;
            socketSend("play:change", "/audio")({play: AudioPlayerStatus.pause});
            break;
        case "STOP":
            newState.playback.state = AudioPlayerStatus.stop;
            socketSend("play:change", "/audio")({play: AudioPlayerStatus.stop});
            break;
    }

    return newState;
};

export const {
    Provider: AudioProvider,
    useTrackedState: useAudioState,
    useUpdate: useAudioDispatch,
} = createContainer<IAudioState, (...args: any[]) => any, {}>(() => {
    const requestedStatus = React.useRef(false);
    const [state, dispatch] = React.useReducer(reducer, audioState);
    const disp = React.useCallback(dispatch, [dispatch]);

    const [requestStatus] = useWebSocket((statusMsg) => {
        if (statusMsg) {
            disp({type: "SET", config: statusMsg as IAudioConfig});
        }
    }, "status", "/audio");

    React.useEffect(() => {
        if (!requestedStatus.current) {
            requestedStatus.current = true;
            requestStatus("");
        }
    },[requestStatus]);

    return [state, dispatch];
});


