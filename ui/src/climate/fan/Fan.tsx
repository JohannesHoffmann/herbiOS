import React from "react";
import { Button, Flex } from "rebass";
import { useClimateDispatch, useClimateState } from "../ClimateContext";

export default function Fan () {
    const {strength, mode} = useClimateState().heater;
    const dispatch = useClimateDispatch();

    return <>
        <Flex>
            <Button 
                onClick={() => {
                    dispatch({type: "FAN", mode: "in", strength: 255});
                }}
            >
                In
            </Button>
            <Button
                onClick={() => {
                    dispatch({type: "FAN", mode: "out", strength: 255});
                }}
            >
                Out
            </Button>
            <Button
                onClick={() => {
                    dispatch({type: "FAN", mode: "inOut", strength: 255});
                }}
            >
                In  Out
            </Button>
            <Button
                onClick={() => {
                    dispatch({type: "FAN", mode: "off"});
                }}
            >
                Off
            </Button>
        </Flex>
    </>
}