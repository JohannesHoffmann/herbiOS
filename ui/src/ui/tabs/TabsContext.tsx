import React from 'react';
import { createContainer } from 'react-tracked';

export interface ITabsState {
    active: string;
    activeTitle: string;
    sections: Array<{
        tabId: string;
        title: string;
    }>;
};

type Actions = {
    type: "ACTIVE_SET",
    tabId: string;
};

const reducer = (state: ITabsState , action: Actions) => {
    let newState: ITabsState = {...{}, ...state};

    switch (action.type) {
        case "ACTIVE_SET":
            newState.active = action.tabId;
            const section =  state.sections.find(item => item.tabId === action.tabId);
            newState.activeTitle = section ? section.title : "";
            break;
    }

    return newState;
};

export const {
    Provider: TabsProvider,
    useTrackedState: useTabsState,
    useUpdate: useTabsDispatch,
} =  createContainer<ITabsState, (...args: any[]) => any, { 
    active: string;
    sections?: ITabsState["sections"];
}>(({active, sections}) => React.useReducer(reducer, { 
    active, 
    activeTitle: sections ? sections[0].title : "",
    sections: sections ? sections : [],
}));