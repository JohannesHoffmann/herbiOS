import React from 'react';
import { Text } from 'rebass';

export default function Temperature() {
    const temperature = 20;

    return <Text paddingX={2}>
        {temperature}°C
    </Text>
}