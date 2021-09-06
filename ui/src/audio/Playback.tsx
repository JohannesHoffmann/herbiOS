import React from 'react';
import { Box, Flex, Text } from 'rebass';
import { FaPlay, FaPause } from "react-icons/fa";
import Config from '../Config';
import { useAudioDispatch, useAudioState } from './AudioContext';
import { AudioPlayerStatus } from './IAudio';

export default function Playback () {
    const { playback } = useAudioState();
    const dispatch = useAudioDispatch();

    const background = playback ? playback.artwork.replace("herbi://", Config.host) : "grey";

    return <Box
            fontSize={4}
            height="100%"
            mb={4}
        >
            {playback && <Box>
                <Flex alignItems="center">
                    <Box mr={4}>
                        <Box
                            css={{background}}
                            variant="tile"
                            sx={{
                                width: "100px",
                                height: "100px",
                            }}
                        >
                            <br />
                        </Box>
                    </Box>
                    <Box flexGrow={1}>
                        {playback.type === "radio" && <Flex alignItems="center">
                            {playback.state === AudioPlayerStatus.play && <FaPause onClick={() => { dispatch({type: "PAUSE"});}} />}
                            {playback.state !== AudioPlayerStatus.play && <FaPlay  onClick={() => { dispatch({type: "PLAY"});}} />}
                            <Text fontSize={[3, 4, 5]} ml={3} color="text">
                                {playback.name}
                            </Text>
                        </Flex>}

                        
                    
                        { playback.title && <Text fontSize={[3, 4, 5]} color="text">
                            {playback.title}
                        </Text>}

                        {playback.artist && <Text fontSize={[4, 5, 6]} color="text">
                            {playback.artist}
                        </Text>}
                    </Box>
                </ Flex>
            </Box>}

            {!playback && <>
                <Text fontSize={[3, 4, 5]}  color="white">
                    Keine Wiedergabe
                </Text>
            </>}
        </Box>
}