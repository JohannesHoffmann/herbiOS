import React from "react";
import { Box, Flex } from "rebass";
import Climate from "./Climate";
import { IClimateConfiguration } from "./IClimate";


type Props = {
    configuration: Array<IClimateConfiguration>;
}


function ClimateList(props: Props) {
    const { configuration } = props;

    return <Flex
        flexWrap='wrap' 
        alignItems="stretch" 
    >
        
        {configuration.map((item) => {
            return <Box p={2} key={item.unique_id} sx={{width: ["100%", "100%"]}}>
                <Climate configuration={item} />
            </Box>
        })}
    </Flex>;
}

export default ClimateList;