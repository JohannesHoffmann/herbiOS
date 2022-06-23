import Axios from 'axios';
import React from 'react';
import Config from '../Config';

export interface IApp {
    atTheVan: boolean;
}

type ActionAwayFromTheVan= {
    type: "AWAY_FROM_THE_VAN";
}

type ActionAtTheVan= {
    type: "AT_THE_VAN";
}

type Action = ActionAwayFromTheVan | ActionAtTheVan;

export interface IAppState extends IApp {
    dispatch: (action: Action) => void,
}

let initialState: IAppState = {
    atTheVan: true,
    dispatch: () => {},
};

let AppContext = React.createContext(initialState);

const AppContextProvider = (props: any) => {

      let reducer = (state: IAppState , action: Action) => {
        let newState: IAppState = JSON.parse(JSON.stringify(state));
    
            switch (action.type) {
                case "AT_THE_VAN":
                    newState.atTheVan = true;
                    break;
                case "AWAY_FROM_THE_VAN":
                    newState.atTheVan = false;
                    break;
            }
            
            return newState;
        };

    if (props.value) {
        initialState = props.value;
    }

    let [state, dispatch] = React.useReducer(reducer, initialState);
    let value = { ...state, dispatch };


    React.useEffect(() => {
        const checkAtTheVan = () => {
            Axios.get(Config.host + "/heartbeat?t=" + new Date().toISOString(), {
                timeout: 2000,
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                }
            }).then(() => {
                if (!state.atTheVan) {
                    dispatch({type: "AT_THE_VAN"});
                }
            }).catch(() => {
                if (state.atTheVan) {
                    dispatch({type: "AWAY_FROM_THE_VAN"});
                }
            });
        }; 
        checkAtTheVan();
        const interval = setInterval(checkAtTheVan, 3000);
        return () => {
            clearInterval(interval);
        }
    }, [dispatch, state]);

      return (
      <AppContext.Provider value={value}> {props.children} </AppContext.Provider>
    );
  };
  
  let PathContextConsumer = AppContext.Consumer;
  
  export { AppContext, AppContextProvider, PathContextConsumer };