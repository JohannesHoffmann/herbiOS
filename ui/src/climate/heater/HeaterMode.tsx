import React from "react";
import { useClimateDispatch, useClimateState } from "../ClimateContext";
import OnOffButton from "../../ui/OnOffButton";
import { GiHeatHaze } from "react-icons/gi";

function HeaterModeButton() {
    const {mode} = useClimateState().heater;
    const dispatch = useClimateDispatch();

    const setMode = (on: boolean) => {
        if (on) {
            dispatch({type: "HEATER", mode: "heat"});
        } else {
            dispatch({type: "HEATER", mode: "off"});
        }
    };

    return (
        <OnOffButton
            icon={<GiHeatHaze />}
            label={"Heizung"}
            value={mode === "off" ? false : true}
            onChange={setMode}
        />
    );
}

export default HeaterModeButton;