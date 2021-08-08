import React from "react";
import GeoPosition from "../geo/map/GeoPosition";
import { Flex, Box, SxStyleProp  } from "rebass";
import Weather from "../aroundMe/Weather";

export default function Dashboard () {


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



        <Flex 
            flexWrap='wrap' 
            alignItems="stretch" 
            sx={{
                gridColumn: ["1 / span 4", "1 / 3"], 
                gridRow: ["1 / 1", "1 / span 2"],
            }} >
            <Box p={0} sx={{width: [ "100%", "100%"], borderRadius: 20, overflow: "hidden", "-webkit-mask-image": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC);"}}>
                <GeoPosition />
            </Box>
        </Flex>


        <Flex 
            flexWrap='wrap' 
            alignItems="stretch" 
            sx={{
                gridColumn: ["1 / span 4", "3/ 5"], 
                gridRow: ["4 / 5", "1 / span 2"],
            }} >
            <Box p={0} sx={{width: [ "100%", "100%"]}}>
                <Weather />
            </Box>
        </Flex>
        

        
    </Box>
}