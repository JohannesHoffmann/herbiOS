import React, { useState } from "react";
import { useEffect } from "react";
import { VscPlug } from "react-icons/vsc";
import { Box, Flex } from "rebass";

import { SubTopic, Topic } from "../utils/IMqtt";
import { useMqttPublish } from "../utils/useMqttPublish";
import { useMqttSubscription } from "../utils/useMqttSubscription";
import Fan from "./Fan";
import { IFanConfiguration, IFanState } from "./IFans";


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