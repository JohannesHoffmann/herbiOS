import React from 'react';
import { Text } from 'rebass';
import { useClimateState } from './ClimateContext';

export default function Temperature() {
    const {temperature} = useClimateState();

    return <Text paddingX={2}>
        {temperature}°C
    </Text>
}