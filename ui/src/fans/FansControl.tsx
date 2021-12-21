import React from "react";
import { Box, Flex } from "rebass";
import Fan from "./Fan";
import { IFanConfiguration } from "./IFans";


type Props = {
    configuration: Array<IFanConfiguration>;
}


function FansControl(props: Props) {
    const { configuration } = props;

    return <Flex
        flexWrap='wrap' 
        alignItems="stretch" 
    >
        
        {configuration.map((item) => {
            return <Box p={2} key={item.unique_id} sx={{width: ["100%", "100%"]}}>
                <Fan configuration={item} />
            </Box>
        })}
    </Flex>;
}

export default FansControl;