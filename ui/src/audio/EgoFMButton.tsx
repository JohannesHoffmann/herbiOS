import React from 'react';
import { useAudioDispatch, useAudioState } from './AudioContext';
import OnOffButton from '../ui/OnOffButton';

export default function EgoFMButton () {
    const {playback} = useAudioState();
    const dispatch = useAudioDispatch();

    return <OnOffButton
        label="EgoFM"
        bgOn="#9BBD32"
        value={playback && playback.name === "EgoFM" && playback.state === "play" ? true : false}
        onChange={(value) => {
            if (value) {
                dispatch({type: "PLAYBACK", name: "EgoFM"});
            } else {
                dispatch({type: "STOP"});
            }
        }}
    />
}