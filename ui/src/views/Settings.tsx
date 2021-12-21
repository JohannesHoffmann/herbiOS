import React from "react";
import { Box, Flex } from "rebass";
import Lights from "../lights/Lights";
import Audio from "../audio/Audio";
import Switches from "../switches/Switches";
import Climates from "../climate/Climates";

export default function Settings () {

    return <Box sx={{
        display: "grid",
        gridTemplateColumns:[ "1fr 1fr 1fr 1fr 1fr"],
        gridTemplateRows: ["auto auto auto auto", "auto auto auto"],
        gridColumnGap: 3,
        gridRowGap: 3,
    }}>

        <Box
            p={2}
            sx={{
                gridColumn: ["1 / span 5", "1 / 3"], 
                gridRow: ["1 / 1", "1 / span 3"],
            }} >
            <Lights />
        </Box>

        <Box
            p={2}
            sx={{
                gridColumn: ["1 / span 5", "3 / 5"], 
                gridRow: ["2 / 3", "1 / span 3"],
            }} 
        >
            <Audio />
            <Climates />
        </Box>

    <Flex
        flexWrap='wrap' 
        alignItems="stretch" 
        sx={{
            gridColumn: ["1 / span 5", "5 / 6"], 
            gridRow: ["4 / 4", "1 / span 3"],
        }} >

            <Box p={2} sx={{width: ["100%"]}}>
                <Switches />
            </Box>
        </Flex>
        
    </Box>
}