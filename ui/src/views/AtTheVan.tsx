import React from "react";
import Wifi from "../networking/Wifi";
import Cellular from "../networking/Cellular";
import GeoIndicator from "../geo/GeoIndicator";
import { Flex, Box } from "rebass";
import {TabsProvider} from "../ui/tabs/TabsContext";
import TabContent from "../ui/tabs/TabContent";
import Settings from "./Settings";
import Dashboard from "./Dashboard";
import TabletMenu from "../components/menus/TabletMenu";
import MobileHeader from "../components/header/MobileHeader";
import MobileMenu from "../components/menus/MobileMenu";
import Sensors from "../sensors/Sensors";

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
                            <Sensors inList={["temperature1", "humidity1", "battery1"]} variant="small" />
                            <GeoIndicator />
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
        <Flex flexDirection="column" p={20} pt={[35, 0]}>

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