import React from 'react';
import { createContainer } from 'react-tracked';
import { socketSend, useWebSocket } from '../utils/useWebSocket';
import { CellularConnectionStatus, INetworkingConfig } from './INetworking';
import { cloneDeep } from "lodash";

type Actions = {
    type: "SET";
    config: Partial<INetworkingState>;
} | {
    type: "WIFI";
    on: boolean;
} | {
    type: "CELLULAR";
    on: boolean;
};

export interface INetworkingState extends INetworkingConfig {

}

let networkingState: INetworkingState = {
    wifi: true,
    cellular: false,
    cellularStatus: {
        maxSignal: 0,
        connectionStatus: CellularConnectionStatus.disconnected,
        currentNetworkType: "LTE",
    }
}

const reducer = (state: INetworkingState , action: Actions) => {
    let newState: INetworkingState = cloneDeep(state);

    switch (action.type) {
        case "SET":
            newState = {
                ...newState,
                ...action.config,
            }
            break;

        case "WIFI":
            newState.wifi = action.on;
            socketSend("wifi:change", "/networking")({on: action.on});
            break;
        
            case "CELLULAR":
            newState.cellular = action.on;
            socketSend("cellular:change", "/networking")({on: action.on});
            break;
    }

    return newState;
};

export const {
    Provider: NetworkingProvider,
    useTrackedState: useNetworkingState,
    useUpdate: useNetworkingDispatch,
} = createContainer<INetworkingState, (...args: any[]) => any, {}>(() => {
    const [statusMsg, requestStatus] = useWebSocket("status", "/networking");
    const requestedStatus = React.useRef(false);

    const [state, dispatch] = React.useReducer(reducer, networkingState);

    React.useEffect(() => {
        if (!requestedStatus.current) {
            requestedStatus.current = true;
            requestStatus("");
        }
    },[requestStatus]);

    const disp = React.useCallback(dispatch, []);

    React.useEffect(() => {
        if (statusMsg) {
            disp({type: "SET", config: statusMsg as INetworkingConfig});
        }
    }, [statusMsg, disp]);

    return [state, dispatch];
});


