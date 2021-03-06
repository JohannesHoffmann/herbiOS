import React from "react";
import Wifi from "../networking/Wifi";
import Temperature from "../climate/Temperature";
import Battery from "../power/Battery";
import Cellular from "../networking/Cellular";
import GeoIndicator from "../geo/GeoIndicator";
import { Flex, Box, Text } from "rebass";
import {TabsProvider} from "../ui/tabs/TabsContext";
import TabContent from "../ui/tabs/TabContent";
import Settings from "./Settings";
import Dashboard from "./Dashboard";
import TabletMenu from "../components/menus/TabletMenu";
import MobileHeader from "../components/header/MobileHeader";
import MobileMenu from "../components/menus/MobileMenu";

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

        <TabsProvider 
            active="settings"
            sections={[{tabId: "settings", title: "control"}, {tabId: "dashboard", title: "inform"}]}
        >
        <Flex flexDirection="column" p={20} pt={0}>

            <TabletMenu />
            <MobileHeader />
            

            
            <TabContent tabId="settings">
                <Settings />
            </TabContent>
            
            <TabContent tabId="dashboard">
                <Dashboard />
            </TabContent>
            

            <MobileMenu />
            
        </Flex>
        </TabsProvider>
        </>
}