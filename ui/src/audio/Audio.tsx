import React from "react";
import { Box, Heading, Flex } from "rebass";
import { useAudioState } from "./AudioContext";
import Equalizer from "./equalizer/Equalizer";
import { AudioPlayerStatus } from "./IAudio";
import Playback from "./Playback";
import Source from "./Source";
import Volume from "./Volume";

export default function Audio () {
    const { playback } = useAudioState();

    return <Box
        variant="tile"
        sx={{
            position: "relative",
            overflow: "hidden",
        }}
    >
        <Flex
            sx={{
                position: "absolute",
                bottom: "-1px",
                left: 0,
                right: 0,
                top: 0,
            }} 
            alignItems="flex-end"
        >
            <Equalizer 
                height={60} 
                width={660} 
                play={playback.state === AudioPlayerStatus.play ? true : false}
                style={{
                    width: "100%",
                }}
                size={[8, 6]}
                margin={2}
                variant="circle"
            />
        </Flex>

        <Box
            pl={3}
            pr={3}
            sx={{
                zIndex: 10,
                position: "relative",
            }}
        >
            <Flex alignItems="center">
                <Heading>Musik</Heading>
                <Box flexGrow={1}><br /></Box>
                <Source />
                
            </Flex>
            <Playback />
            <Volume />
        </Box>
    </Box>
}