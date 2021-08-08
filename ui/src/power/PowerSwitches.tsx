import React from "react";
import { VscPlug } from "react-icons/vsc";
import { Box, Flex } from "rebass";
import OnOffButton from "../ui/OnOffButton";
import { IPowerState, usePowerDispatch, usePowerState } from "./PowerContext";


function PowerSwitches() {
    const { switches } = usePowerState();
    const dispatch = usePowerDispatch();

    const set = (name: keyof IPowerState["switches"], on: boolean) => {
            dispatch({type: "SWITCH_SET", name, on});
    };

    return <Flex
        flexWrap='wrap' 
        alignItems="stretch" 
    >
        {Object.entries(switches).map(([key, on]) => {
            const name = key as keyof IPowerState["switches"];
            
            return <Box p={2} key={name} sx={{width: ["50%", "100%"]}}>
                <OnOffButton
                    label={name}
                    value={on}
                    onChange={() => { set(name, !switches[name]) }}
                    icon={<VscPlug />}
                />
            </Box>
        })}
    </Flex>;
}

export default PowerSwitches;