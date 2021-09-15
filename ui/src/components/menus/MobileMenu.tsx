import { useTheme } from "emotion-theming";
import React from "react";
import { Box, Flex } from "rebass";
import TourButtonMobile from "../../touring/TourButtonMobile";
import IconDashboard from "../../ui/icons/IconDashboard";
import IconSettings from "../../ui/icons/IconSettings";
import { useTabsDispatch, useTabsState } from "../../ui/tabs/TabsContext";

export default function MobileMenu () {
    const setActive = useTabsDispatch();
    const {active} = useTabsState();
    const theme: any= useTheme();

    const tabActive = (tabId: string) => {
        setActive({type: "ACTIVE_SET", tabId});
    }
    
    const getColor = (tabId: string) => {
        if (active === tabId) {
            return theme.name === "light" ? "black" : "white"
        }
        return theme.name === "light" ? "grey" : "lightGrey"
    }

    return <>
    
        <Box
            display={["block", "none"]}
            sx={(theme) => ({
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "backgroundLight",
                boxShadow: theme.name === "light" ? "0px -2px 4px rgba(229, 229, 229, 0.3)" : "0px -2px 4px rgba(26, 16, 16, 0.3)",
                zIndex: 9000,
            })}
            p={3}
        >
            <Flex
                ml={40}
                mr={40}
                justifyContent="space-between"
            >
                <Box
                    onClick={() => { tabActive("settings") }}
                >
                    <IconSettings 
                        color={getColor("settings")} 
                        width={44} 
                        
                    />
                </Box>

                <TourButtonMobile />

                <Box
                    onClick={() => { tabActive("dashboard") }}
                >
                    <IconDashboard 
                        color={getColor("dashboard")} 
                        width={44}  
                    />
                </Box>

            </Flex>

        </Box>

        {/* Placeholder to scroll over area the fixed menu takes */}
        <Box
            display={["block", "none"]}
            sx={{
                height: 100,
            }}
            p={3}
        >
            <br />
        </Box>
    </>
}