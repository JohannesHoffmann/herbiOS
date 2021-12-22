import React from "react";
import { Box, Flex } from "rebass";
import Sensor, { SensorVariant } from "./Sensor";
import { ISensorConfiguration } from "./ISensors";


type Props = {
    configuration: Array<ISensorConfiguration>;
    variant?: SensorVariant;
}


function SensorList(props: Props) {
    const { configuration, variant } = props;
    const padding = variant === "small" ? 0 : 2;
    
    return <Flex
        flexWrap='wrap' 
        alignItems="stretch" 
        flexDirection={variant === "small" ? "row" : "column"}
    >   
        {configuration.map((item) => {
            return <Box pt={padding} pb={padding} key={item.unique_id}>
                <Sensor configuration={item} variant={variant} />
            </Box>
        })}
    </Flex>;
}

export default SensorList;