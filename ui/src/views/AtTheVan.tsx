import React from "react";
import Clock from "../components/Clock";
import Wifi from "../networking/Wifi";
import Temperature from "../climate/Temperature";
import Battery from "../power/Battery";
import Cellular from "../networking/Cellular";
import GeoIndicator from "../geo/GeoIndicator";
import { Flex, Box } from "rebass";
import {TabsProvider} from "../ui/tabs/TabsContext";
import TabButton from "../ui/tabs/TabButton";
import IconSettings from "../ui/icons/IconSettings";
import IconDashboard from "../ui/icons/IconDashboard";
import TabContent from "../ui/tabs/TabContent";
import Settings from "./Settings";
import Dashboard from "./Dashboard";

export default function AtTheVan() {

    return <>
        <Box>
            <Flex flexWrap='wrap' alignItems="stretch">
                <Box p={2} sx={{
                    flexGrow: 1,
                }}>
                    
                </Box>
                <Box p={2}>
                        <Flex >
                            <GeoIndicator />
                            <Temperature />
                            <Battery />
                            <Wifi />
                            <Cellular />
                        </Flex>
                </Box>
            </Flex>
        </Box>

        <TabsProvider active="settings">
        <Flex flexDirection="column" p={20}>

            <Box>

                <Flex flexWrap='wrap' alignItems="stretch">
                    <Flex p={2} sx={{
                        flexGrow: 1,
                    }}>
                        
                        
                            <TabButton tabId="settings" label="Settings">
                                <IconSettings color="white" />
                            </TabButton>
                            <TabButton tabId="dashboard" label="Dashboard">
                                <IconDashboard color="white" />
                            </TabButton>

                    </Flex>
                    <Box p={2}>
                        <Clock />
                    </Box>
                </Flex>

            </Box>

            
            <TabContent tabId="settings">
                <Settings />
            </TabContent>
            
            <TabContent tabId="dashboard">
                <Dashboard />
            </TabContent>
            



            <Box>

                    

            </Box>
        </Flex>
        </TabsProvider>
        </>
}