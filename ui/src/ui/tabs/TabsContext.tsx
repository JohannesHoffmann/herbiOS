import React from 'react';
import { createContainer } from 'react-tracked';

export interface ITabsState {
    active: string;
};

type Actions = {
    type: "ACTIVE_SET",
    tabId: string;
};


let userState: ITabsState= {
    active: "",
}

const reducer = (state: ITabsState , action: Actions) => {
    let newState: ITabsState = {...{}, ...state};

    switch (action.type) {
        case "ACTIVE_SET":
            newState.active = action.tabId;
            break;
    }

    return newState;
};

const useValue = () => React.useReducer(reducer, userState);

export const {
    Provider: TabsProvider,
    useTrackedState: useTabsState,
    useUpdate: useTabsDispatch,
} =  createContainer<ITabsState, (...args: any[]) => any, { 
    active: string;
}>(({active}) => React.useReducer(reducer, { active }));