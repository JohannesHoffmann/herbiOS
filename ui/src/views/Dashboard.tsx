import React from "react";
import GeoPosition from "../geo/map/GeoPosition";
import { Flex, Box } from "rebass";
import Weather from "../aroundMe/Weather";

export default function Dashboard () {

    return <Box sx={{
        display: "grid",
        gridTemplateColumns:[ "1fr 1fr 1fr 1fr 1fr"],
        gridTemplateRows: ["auto auto auto auto", "auto auto auto"],
        gridColumnGap: 3,
        gridRowGap: 3,
    }}>



        <Flex 
            flexWrap='wrap' 
            alignItems="stretch" 
            sx={{
                gridColumn: ["1 / span 5", "3/ 5"], 
                gridRow: ["4 / 5", "1 / span 3"],

            }} >
                <GeoPosition />
        </Flex>


        <Flex 
            flexWrap='wrap' 
            alignItems="stretch" 
            sx={{
                gridColumn: ["1 / span 5", "1 / 3"], 
                gridRow: ["1 / 1", "1 / span 3"],
            }} >
            <Box p={0} sx={{width: [ "100%", "100%"]}}>
                <Weather />
            </Box>
        </Flex>
        

        
    </Box>
}