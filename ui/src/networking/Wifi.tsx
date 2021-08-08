import React from 'react';
import {BiWifi, BiWifiOff} from "react-icons/bi";
import { Text } from 'rebass';
import { useNetworkingDispatch, useNetworkingState } from './NetworkingContext';

export default function Wifi () {
    const { wifi } = useNetworkingState();
    const dispatch = useNetworkingDispatch();

    const changeWifi= (on: boolean) => {
            dispatch({type: "WIFI", on});
    };

    return <Text paddingX={2}>
        {wifi && <BiWifi onClick={() => { changeWifi(false)}} />}
        {!wifi && <BiWifiOff  onClick={() => { changeWifi(true)}} />}
    </ Text>
}