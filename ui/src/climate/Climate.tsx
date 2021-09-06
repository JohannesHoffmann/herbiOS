import React from "react";
import { Box, Heading, Flex, Text } from "rebass";
import { IClimateState, useClimateDispatch, useClimateState } from "./ClimateContext";
import Fan from "./fan/Fan";
import HeaterStepButton from "./heater/HeaterSteps";
import { ClimateMode } from "./IClimate";

export default function Climate () {
    const climate = useClimateState();
    const dispatch = useClimateDispatch();

    const setMode = (mode: IClimateState["mode"]) => {
        dispatch({type: "MODE", mode})
    }

    return <Box
        variant="tile"
        mt={4}
    >
        <Box
            p={3}
            pr={3}
            pl={3}
            sx={{
                zIndex: 10,
                position: "relative",
            }}
        >
            <Flex alignItems="center">
                <Heading>Heizung</Heading>
                <Box flexGrow={1}><br /></Box>
                <Text 
                    color={climate.mode === ClimateMode.temperature ? "primary" : "default"} 
                    mr={4}
                    onClick={() => setMode(ClimateMode.temperature)}
                >
                    Automatik
                </Text>
                <Text
                    color={climate.mode === ClimateMode.manual ? "primary" : "default"} 
                    onClick={() => setMode(ClimateMode.manual)}
                >
                    Manuell
                </Text>
            </Flex>

            {climate.mode === ClimateMode.manual && <Box>

                <HeaterStepButton />
                <Fan />

            </Box>}

            {climate.mode === ClimateMode.temperature && <Box>

                Automatic

            </Box>}
        </Box>
    </Box>
}