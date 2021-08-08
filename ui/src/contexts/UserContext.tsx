import React from 'react';
import { createContainer } from 'react-tracked';

export interface IUser {name: string, type: string, iat: number, exp: number,};

type ActionUserLogin= {
    type: "LOGIN";
    authToken: string;
}

type ActionUserLogout= {
    type: "LOGOUT";
}

type ActionUserReAuth = {
    type: "REAUTH";
}

type Actions = ActionUserLogin | ActionUserLogout | ActionUserReAuth;

export interface IUsersState {
    user: IUser;
    authToken: string;
    password: string;
}

const localStorageKeyAuth: string = "authentication";
const localStorageKeyPass: string = "password";
const authTokenFromLocalStorage = localStorage.getItem(localStorageKeyAuth) ? String(localStorage.getItem(localStorageKeyAuth)) : "";
const passwordFromLocalStorage = localStorage.getItem(localStorageKeyPass) ? String(localStorage.getItem(localStorageKeyPass)) : "";


let userState: IUsersState = {
    authToken: authTokenFromLocalStorage,
    password: passwordFromLocalStorage,
    user: {
        exp: 0,
        iat: 0,
        name: "",
        type: "",
    },
}

const reducer = (state: IUsersState , action: Actions) => {
    let newState: IUsersState = {...{}, ...state};

    switch (action.type) {
        case "LOGIN":
            newState.authToken = action.authToken;
            localStorage.setItem(localStorageKeyAuth, action.authToken);
            break;

        case "LOGOUT":
            newState.authToken = "";
            localStorage.removeItem(localStorageKeyAuth);
            break;
    }

    return newState;
};

const useValue = () => React.useReducer(reducer, userState);

export const {
    Provider: UserProvider,
    useTrackedState: useUserState,
    useUpdate: useUserDispatch,
} = createContainer(useValue);