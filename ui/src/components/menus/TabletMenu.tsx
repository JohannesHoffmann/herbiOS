import React from "react";
import { Box, Flex } from "rebass";
import TourButton from "../../touring/TourButton";
import IconDashboard from "../../ui/icons/IconDashboard";
import IconSettings from "../../ui/icons/IconSettings";
import TabButton from "../../ui/tabs/TabButton";
import Clock from "../Clock";


export default function TabletMenu () {

    return <Box display={["none", "block"]}>

    <Flex flexWrap='wrap' alignItems="stretch">
        <Flex p={2} sx={{
            flexGrow: 1,
        }}>
                <TabButton tabId="settings" label="Settings">
                    <IconSettings color="white" width={44} />
                </TabButton>
                <TabButton tabId="dashboard" label="Dashboard">
                    <IconDashboard color="white" width={44}  />
                </TabButton>

        </Flex>
        <Flex p={2} >
            <TourButton />
        </Flex>
        <Box ml={4} p={2} display={["none", "block"]}>
            <Clock />
        </Box>
    </Flex>

</Box>
}