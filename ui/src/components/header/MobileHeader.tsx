import React from "react";
import { Box, Heading } from "rebass";
import { useTabsState } from "../../ui/tabs/TabsContext";


export default function MobileHeader () {
    const tabsState = useTabsState();

    return <Box display={["block", "none"]} mb={4}>
        <Heading fontWeight="bold" fontSize={5}>{tabsState.activeTitle}</Heading>
    </Box>
    
}