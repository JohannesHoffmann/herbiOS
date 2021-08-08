import React from 'react';
import { createContainer } from 'react-tracked';
import {  useWebSocket } from '../utils/useWebSocket';
import { IGeoConfig } from './IGeo';
import { cloneDeep } from "lodash";

type Actions = {
    type: "SET";
    config: Partial<IGeoState>;
};

export interface IGeoState extends IGeoConfig {

}

let geoState: IGeoState = {
    current: {
        status: 0,
        dateTime: new Date(),
        lat: 0,
        lon: 0,
        headingDeviation: "",
        speed: 0,
        altitude: 0,
        satellites: 0,
    }
}

const reducer = (state: IGeoState , action: Actions) => {
    let newState: IGeoState = cloneDeep(state);

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
    Provider: GeoProvider,
    useTrackedState: useGeoState,
    useUpdate: useGeoDispatch,
} = createContainer<IGeoState, (...args: any[]) => any, {}>(() => {
    const [statusMsg, requestStatus] = useWebSocket("status", "/geo");
    const requestedStatus = React.useRef(false);

    const [state, dispatch] = React.useReducer(reducer, geoState);

    React.useEffect(() => {
        if (!requestedStatus.current) {
            requestedStatus.current = true;
            requestStatus("");
        }
    },[requestStatus]);

    const disp = React.useCallback(dispatch, []);

    React.useEffect(() => {
        if (statusMsg) {
            disp({type: "SET", config: statusMsg as IGeoConfig});
        }
    }, [statusMsg, disp]);

    return [state, dispatch];
});


