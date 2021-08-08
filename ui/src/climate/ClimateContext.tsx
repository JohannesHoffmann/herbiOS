import React, { Reducer } from 'react';
import { createContainer } from 'react-tracked';
import { useWebSocket } from '../utils/useWebSocket';
import { ClimateMode, FanMode, HeaterMode, HeaterStrength, IClimateConfig } from './IClimate';
import { useReducerAsync, AsyncActionHandlers } from 'use-reducer-async';
import produce from "immer";


type ActionSetConfig = {
    type: "SET";
    config: Partial<IClimateState>;
}

type ActionModeConfig = {
    type: "MODE";
    mode: IClimateState["mode"];
}

type ActionSetHeater = {
    type: "HEATER";
    mode?: HeaterMode;
    strength?: HeaterStrength;
}

type ActionSetFan= {
    type: "FAN";
    mode?: FanMode;
    strength?: number;
}

type Actions = ActionSetConfig | ActionSetHeater | ActionModeConfig | ActionSetFan;

export interface IClimateState extends IClimateConfig {

}

let climateState: IClimateState = {
    humidity: 0,
    temperature: 15,
    heater: {
        mode: HeaterMode.off,
        strength: 0,
    },
    fan: {
        mode: FanMode.off,
        strength: 0,
    },
    mode: ClimateMode.manual,
    temperatureControl: {
        temperature: 15,
        hysteresisMax: 3,
        hysteresisMin: 5,
    }
}

const reducer = (state: IClimateState , action: Actions) => {
    return produce(state, (draftState) => {
        switch (action.type) {
            case "SET":
                draftState = {
                    ...state,
                    ...action.config,
                }
                break;
    
            case "MODE":
                draftState.mode = action.mode;
                break;
    
            case "HEATER":
                draftState.heater = {
                    mode: action.mode ? action.mode : state.heater.mode,
                    strength: action.strength !== undefined ? action.strength : state.heater.strength,
                }
                break;
    
            case "FAN":
                draftState.fan = {
                    mode: action.mode ? action.mode : state.fan.mode,
                    strength: action.strength !== undefined ? action.strength : state.fan.strength,
                }
                break;
        }
    
        return draftState;

    });
};

type AsyncActionHeater = { type: 'HEATER'; id: string };
type AsyncActionFan = { type: 'FAN'; id: string };
type AsyncAction =  AsyncActionHeater | AsyncActionFan;



export const {
    Provider: ClimateProvider,
    useTrackedState: useClimateState,
    useUpdate: useClimateDispatch,
} = createContainer<IClimateState, (...args: any[]) => any, {}>(() => {
    const [statusMsg, requestStatus] = useWebSocket("status", "/climate");
    const [, emitHeaterChange] = useWebSocket("heater:change", "/climate");
    const [, emitFanChange] = useWebSocket("fan:change", "/climate");
    const requestedStatus = React.useRef(false);

    const asyncActionHandlers: AsyncActionHandlers<
        Reducer<IClimateState, Actions>,
        AsyncAction
    > = {
        HEATER: ({ dispatch }) => async (action) => {
            emitHeaterChange(action);
            dispatch(action);
        },
        FAN: ({ dispatch }) => async (action) => {
            emitFanChange(action);
            dispatch(action);
        },
    }


    const [state, dispatch] = useReducerAsync<Reducer<IClimateState, Actions>, AsyncAction>(reducer, climateState, asyncActionHandlers);

    React.useEffect(() => {
        if (!requestedStatus.current) {
            requestedStatus.current = true;
            requestStatus("");
        }
    },[requestStatus]);

    const disp = React.useCallback(dispatch, []);

    React.useEffect(() => {
        if (statusMsg) {
            disp({type: "SET", config: statusMsg as IClimateConfig});
        }
    }, [statusMsg, disp]);

    return [state, dispatch];
});


