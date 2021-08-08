import React from 'react';
import {MdSignalCellularOff, MdSignalCellular4Bar, MdSignalCellular3Bar, MdSignalCellular2Bar, MdSignalCellular1Bar, MdSignalCellular0Bar} from "react-icons/md";
import { Text } from 'rebass';
import { useNetworkingDispatch, useNetworkingState } from './NetworkingContext';

export default function Cellular () {
    const { cellular, cellularStatus } = useNetworkingState();
    const dispatch = useNetworkingDispatch();

    const change= (on: boolean) => {
            dispatch({type: "CELLULAR", on});
    };

    let connectionStrength = <MdSignalCellular4Bar />
    switch (cellularStatus.maxSignal) {
        case 4:
            connectionStrength = <MdSignalCellular3Bar />;
            break;
        case 3:
            connectionStrength = <MdSignalCellular2Bar />;
            break;
        case 2:
            connectionStrength = <MdSignalCellular1Bar />;
            break;
        case 1:
            connectionStrength = <MdSignalCellular0Bar />;
            break;
    }
    
    return <Text paddingX={2}>
        {cellular && <span onClick={() => { change(false)}}>
            {connectionStrength}
            {cellularStatus.currentNetworkType}
        </span>}
        {!cellular && <MdSignalCellularOff  onClick={() => { change(true)}} />}
    </ Text>
}