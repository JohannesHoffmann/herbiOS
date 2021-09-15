import React from "react";
import { Box, Flex, Heading } from "rebass";
import IconBus from "../../ui/icons/IconBus";
import Slider from "../../ui/slider/Slider";
import { useTabsState } from "../../ui/tabs/TabsContext";
import MoreMenu from "../more/MoreMenu";


export default function MobileHeader () {
    const tabsState = useTabsState();
    const [open, setOpen] = React.useState(false);
    console.log("open mobile header", open);
    return <>
    <Flex
        display={["block", "none"]} 
        mb={4}
        p={2}
        pl={3}
        pr={3}
        sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: "background",
            zIndex: 999,
        }}
    >
        <Flex p={2} width="100%">
            <Heading flexGrow={1} fontWeight="bold" fontSize={5}>{tabsState.activeTitle}</Heading>
            <Box onClick={() => {setOpen(true);}}>
                <IconBus color="green" secondary="background"  />
            </Box>
        </Flex>
    </Flex>
        <Slider open={open} onClose={() => {setOpen(false); console.log("Called onclose"); }} label="More">
            <MoreMenu />
        </Slider>
    </>
    
}