import React from 'react';
import {FaSatellite} from "react-icons/fa";
import { Text } from 'rebass';
import { useGeoState } from './GeoContext';

export default function GeoIndicator () {

    const { satellites} = useGeoState().current;


    return <Text paddingX={2}>
        <FaSatellite />{satellites}
    </ Text>
}