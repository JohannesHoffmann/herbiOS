import React from "react";
import SwitchToggle from "../../ui/SwitchToggle";
import { useWebSocket } from "../../utils/useWebSocket";
import { useClimateDispatch, useClimateState } from "../ClimateContext";

type Props = {
    label: string;
    id: string;
}

export default function VentilationButton(props: Props) {
    const {id, label} = props;
    const ventilations = useClimateState().ventilations;
    const dispatch = useClimateDispatch();

    const vent = ventilations.find(v => v.id === id);

    if (!vent) {
        return null;
    }

    return <SwitchToggle label={label} onChange={(value) => {
            if (value) {
                dispatch({type: "VENTILATION", id, strength: 255});
            } else {
                dispatch({type: "VENTILATION", id, strength: 0});
            }
    }} />
}