import React from 'react';
import { createContainer } from 'react-tracked';
import { useWebSocket } from '../utils/useWebSocket';
import { IPowerConfig, SolarMode } from './IPower';
import { cloneDeep } from "lodash";

type Actions = {
    type: "SET";
    config: Partial<IPowerState>;
};

export interface IPowerState extends IPowerConfig {

}

let powerState: IPowerState = {
    solar: SolarMode.parallel,
    batteryVolt: 130,
    settings: {
        batteryVoltMax: 138,
        batteryVoltMin: 105,
    },
    solarLastLog: {
        time: new Date(),
        volt: 135,
        watt: 65,
        ampere: 4,
        mode: SolarMode.parallel,
    }
}

const reducer = (state: IPowerState , action: Actions) => {
    let newState: IPowerState = cloneDeep(state);

    switch (action.type) {
        case "SET":
            newState = {
                ...newState,
                ...action.config,
            }
            break;
    }

    return newState;
};

export const {
    Provider: PowerProvider,
    useTrackedState: usePowerState,
    useUpdate: usePowerDispatch,
} = createContainer<IPowerState, (...args: any[]) => any, {}>(() => {
    const [statusMsg, requestStatus] = useWebSocket("status", "/power");
    const requestedStatus = React.useRef(false);

    const [state, dispatch] = React.useReducer(reducer, powerState);

    React.useEffect(() => {
        if (!requestedStatus.current) {
            requestedStatus.current = true;
            requestStatus("");
        }
    },[requestStatus]);

    const disp = React.useCallback(dispatch, []);

    React.useEffect(() => {
        if (statusMsg) {
            disp({type: "SET", config: statusMsg as IPowerConfig});
        }
    }, [statusMsg, disp]);

    return [state, dispatch];
});


