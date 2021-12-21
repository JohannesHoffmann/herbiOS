import React, { useEffect, useState } from 'react';
import { Text } from 'rebass';
import { SubTopic, Topic } from '../utils/IMqtt';
import { useMqttSubscription } from '../utils/useMqttSubscription';
import { IClimateConfiguration } from './IClimate';

export default function Temperature() {
    const temperature = 20;

    return <Text paddingX={2}>
        {temperature}°C
    </Text>
}