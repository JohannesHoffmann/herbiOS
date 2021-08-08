import React from "react";
// import EgoFM from "../components/EgoFMButton";
import Playback from "../audio/Playback";
import HeaterStepButton from "../climate/heater/HeaterSteps";
import HeaterModeButton from "../climate/heater/HeaterMode";
import { Flex, Box, SxStyleProp  } from "rebass";
import LightButton from "../lights/LightButton";
import VolumeButton from "../audio/Volume";
import PowerSwitches from "../power/PowerSwitches";
import { Label } from "@rebass/forms";
import Lights from "../lights/Lights";
import Audio from "../audio/Audio";
import Climate from "../climate/Climate";

export default function Settings () {


    const group: SxStyleProp = {
        padding: 0.5,
        border: theme => `2px solid ${theme.colors.backgroundLight}`,
        borderRadius: 30,
    }

    return <Box sx={{
        display: "grid",
        gridTemplateColumns:[ "1fr 1fr 1fr 1fr"],
        gridTemplateRows: ["auto auto auto auto", "auto auto auto"],
        gridColumnGap: 3,
        gridRowGap: 3,
    }}>

        <Box
            p={2}
            sx={{
                gridColumn: ["1 / span 4", "1 / 3"], 
                gridRow: ["1 / 1", "1 / span 3"],
            }} >
            <Lights />
        </Box>

        <Box
            p={2}
            sx={{
                gridColumn: ["1 / span 4", "3 / 5"], 
                gridRow: ["2 / 3", "1 / span 3"],
            }} 
        >
            <Audio />
            <Climate />
        </Box>

        {/* <Flex 
            flexWrap='wrap' 
            alignItems="stretch" 
            sx={{
                gridColumn: ["1 / span 4", "2/ 3"], 
                gridRow: ["2 / 2", "1 / span 2"],
                ...group,
            }} >

            <Box p={2} sx={{width: [ "50%", "100%"]}}>
                <Playback />
            </Box>

            <Box p={2} sx={{ width: [ "50%", "100%"]}}>
                <VolumeButton />
            </Box>
        </Flex> */}


    {/* <Flex 
        flexWrap='wrap' 
        alignItems="stretch" 
        sx={{
            gridColumn: ["1 / span 4", "3 / 4"], 
            gridRow: ["3 / 3", "1 / span 2"],
            ...group,
        }} >

            <Box p={2} sx={{width: [ "50%", "100%"]}}>
                <HeaterModeButton />
            </Box>

            <Box p={2} sx={{width: [ "50%", "100%"]}}>
                <HeaterStepButton />
            </Box>
        </Flex> */}

    {/* <Flex 
        flexWrap='wrap' 
        alignItems="stretch" 
        sx={{
            gridColumn: ["1 / span 4", "4 / 5"], 
            gridRow: ["4 / 4", "1 / span 3"],
            ...group,
        }} >

            <Box p={2} sx={{width: ["100%"]}}>
                <PowerSwitches />
            </Box>
        </Flex> */}
        
    </Box>
}