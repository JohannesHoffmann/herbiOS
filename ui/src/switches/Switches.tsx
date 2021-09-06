import React from "react";
import { useEffect } from "react";
import { VscPlug } from "react-icons/vsc";
import { Box, Flex } from "rebass";
import SwitchToggle from "../ui/SwitchToggle";
import { useWebSocket } from "../utils/useWebSocket";

interface ISwitch {
    name: string;
    id: number;
    isOn: boolean;
}

function Switches() {
    const [switches, getSwitches] = useWebSocket<Array<ISwitch>, string>("switches", "/switches");
    const [, setSwitchOn] = useWebSocket<null, {switchId: number}>("switch:on", "/switches");
    const [, setSwitchOff] = useWebSocket<null, {switchId: number}>("switch:off", "/switches");

    useEffect(() => {
        getSwitches("get");
    }, [getSwitches])

    if (!switches) {
        return null;
    }
    
    return <Flex
        flexWrap='wrap' 
        alignItems="stretch" 
    >
        
        {switches.map((item) => {
            return <Box p={2} key={item.id} sx={{width: ["50%", "100%"]}}>
                <SwitchToggle
                    label={item.name}
                    value={!item.isOn}
                    onChange={() => { 
                        if (item.isOn) {
                            setSwitchOff({switchId: item.id}); 
                        } else {
                            setSwitchOn({switchId: item.id}); 
                        }
                    
                    }}
                    icon={<VscPlug />}
                />
            </Box>
        })}
    </Flex>;
}

export default Switches;