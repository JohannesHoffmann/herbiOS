import React from 'react';
import { Box, Flex } from 'rebass';
import { useAudioState } from './AudioContext';
import IconAirPlay from '../ui/icons/IconAirPlay';
import IconSignal from '../ui/icons/IconSignal';


export default function Source () {
    const { playback } = useAudioState();

    return <Box>
            <Flex mb={3} mt={3}>
                <Flex flexDirection="row" alignItems="center" mr={3} sx={{color: playback.type === "airplay" ? "primary" : "grey", fontSize: 2}}>
                    <IconAirPlay color={playback.type === "airplay" ? "primary" : "grey"} /> AirPlay
                </Flex>
                <Flex flexDirection="row" alignItems="center" mr={3} sx={{color: playback.type === "radio" ? "primary" : "grey", fontSize: 2}}>
                    <IconSignal color={playback.type === "radio" ? "primary" : "grey"} /> Radio
                </Flex>
            </Flex>
        </Box>
}