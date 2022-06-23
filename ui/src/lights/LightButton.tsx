import React, { useEffect, useState } from "react";
import LevelButton from "../ui/LevelButton";
import { useWebSocket } from "../utils/useWebSocket";


type Props = {
    label: string;
    id: string;
};

function LightButton(props: Props) {
    const { label, id} = props;
    const [lights, setLights] = useState<{[key: string]: {name: string, id: string, level: number}}>();
    
    const [getLights] = useWebSocket<{[keys: string]: {name: string, id: string, level: number}},string>((lights) => {
        setLights(lights);
    }, "lights", "/lights");
    const [changeLight] = useWebSocket<null, {name: string, value: number}>(() => {}, "light:change", "/lights");
    
    const value: number = lights && lights.hasOwnProperty(id) ? lights[id].level : 0;

    const setLevel = (level: number) => {
        if (value !== level) {
            changeLight({name: id, value: level});
        }
    };

    useEffect(() => {
        if (!lights) {
            getLights("");
        }
    }, [lights, getLights]);
    
    return (
        <LevelButton
            label={label}
            value={value}
            onChange={setLevel}
            disabled={!lights}
        />
    );
}

export default LightButton;