import React from 'react';
import { createContainer } from 'react-tracked';
import { useWebSocket } from '../utils/useWebSocket';
import { IAroundMeConfig } from './IAroundMe';
import { cloneDeep } from "lodash";

type Actions = {
    type: "SET";
    config: Partial<IAroundMeState>;
} | {
    type: "VOLUME";
    level: number;
};

export interface IAroundMeState extends IAroundMeConfig {

}

let aroundMeState: IAroundMeState = {

}

const reducer = (state: IAroundMeState , action: Actions) => {
    let newState: IAroundMeState = cloneDeep(state);

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
    Provider: AroundMeProvider,
    useTrackedState: useAroundMeState,
    useUpdate: useAroundMeDispatch,
} = createContainer<IAroundMeState, (...args: any[]) => any, {}>(() => {
    const [state, dispatch] = React.useReducer(reducer, aroundMeState);
    const disp = React.useCallback(dispatch, [dispatch]);
    const [requestStatus] = useWebSocket<IAroundMeConfig, string>((s) => {
        if (s) {
            disp({type: "SET", config: s});
        }
    }, "status", "/aroundMe");
    const requestedStatus = React.useRef(false);

    React.useEffect(() => {
        if (!requestedStatus.current) {
            requestedStatus.current = true;
            requestStatus("");
        }
    },[requestStatus]);

    


    return [state, dispatch];
});


