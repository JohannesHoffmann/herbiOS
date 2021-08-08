import { Slider } from "@rebass/forms";
import { useTheme } from "emotion-theming";
import React from "react";
import { Box, Flex } from "rebass";
import IconVolumeHigh from "../ui/icons/IconVolumeHigh";
import IconVolumeLow from "../ui/icons/IconVolumeLow";
import { useAudioDispatch, useAudioState } from "./AudioContext";


function Volume() {
    const {volume} = useAudioState();
    const dispatch = useAudioDispatch();
    const theme: any= useTheme();

    const setLevel = (level: number) => {
        if (volume !== level) {
            dispatch({type: "VOLUME", level});
        }
    };
    

    return <Box>
        <Slider
            id='percent'
            name='percent'
            defaultValue={volume}
            onChange={(e) => setLevel(Number(e.currentTarget.value))}
            sx={{
                height: 5,
                background: `linear-gradient(to right, ${theme.colors.primary} 0%,${theme.colors.primary} ${volume}%, ${theme.colors.primary}80 ${volume}%, ${theme.colors.primary}80 100%);`,
                "&::-webkit-slider-thumb": {
                    bg: "primary",
                    width: 16,
                    height: 16,
                },
                "&::-moz-range-thumb" : {
                    bg: "primary",
                    border: 0,
                    width: 16,
                    height: 16,
                }
            }}
        />
        <Flex>
            <Box>
                <IconVolumeLow color="grey" width={30} />
            </Box>
            <Box flexGrow={1}></Box>
            <Box>
                <IconVolumeHigh color="grey" width={30} />
            </Box>
        </Flex>

    </Box>
    
}

export default Volume;