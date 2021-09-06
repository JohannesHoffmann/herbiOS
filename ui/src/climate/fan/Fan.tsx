import React from "react";
import { Box, Button, Flex, Heading, SxStyleProp, Text } from "rebass";
import IconArrowDouble from "../../ui/icons/IconArrowDouble";
import IconArrowLeft from "../../ui/icons/IconArrowLeft";
import IconArrowRight from "../../ui/icons/IconArrowRight";
import { useClimateDispatch, useClimateState } from "../ClimateContext";
import { FanMode } from "../IClimate";

export default function Fan () {
    const {mode} = useClimateState().fan;
    const dispatch = useClimateDispatch();
    const buttonStyle: SxStyleProp = {
        marginRight: 2,
        padding: 3,
        width: "28%",
        backgroundColor: "background",
        color: "lightGrey",

    }

    const buttonStyleActive: SxStyleProp = {
        ...buttonStyle,
        backgroundColor: "primary",
        color: "white"
    }

    const setMode = (newMode: FanMode) => {
        if (mode === newMode) {
            dispatch({type: "FAN", mode: "off"});
            return;
        }

        dispatch({type: "FAN", mode: newMode, strength: 255});
    }

    return <Box mt={4}>
        <Heading mb={3}>Lüfter</Heading>
        <Flex justifyContent="space-between">
            <Button 
                sx={{    
                    ...mode === FanMode.in ? buttonStyleActive : buttonStyle,
                }}
                onClick={() => { setMode(FanMode.in); }}
            >
                <IconArrowRight width={30}  color={mode === FanMode.in ? "white" : "lightGrey"} />
                <Text>
                    Ein
                </Text>
            </Button>
            <Button
                sx={{    
                    ...mode === FanMode.out ? buttonStyleActive : buttonStyle,
                }}
                onClick={() => { setMode(FanMode.out); }}
            >
                <IconArrowLeft width={30}  color={mode === FanMode.out ? "white" : "lightGrey"} />
                <Text>
                    Aus
                </Text>
            </Button>
            <Button
                sx={{    
                    ...mode === FanMode.inOut ? buttonStyleActive : buttonStyle,
                }}
                onClick={() => { setMode(FanMode.inOut); }}
            >
                <IconArrowDouble width={30} color={mode === FanMode.inOut ? "white" : "lightGrey"} />
                <Text>
                    Ein Aus
                </Text>
            </Button>
        </Flex>
    </Box>
}