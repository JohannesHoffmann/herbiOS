import React from "react";
import "./App.css";
import "leaflet/dist/leaflet.css";
import "mapbox-gl/dist/mapbox-gl.css"

import { ThemeProvider } from "emotion-theming";

import theme from "./theme";
import themeDark from "./themeDark";

import { AppContext } from "./contexts/AppStateContext";
import AtTheVan from "./views/AtTheVan";
import NotAtTheVan from "./views/NotAtTheVan";
import SocketAuthenticator from "./SocketAuthenticator";
import { useThemeDetector } from "./utils/useThemeDetector";
import { Box } from "rebass";
import { UserProvider } from "./contexts/UserContext";
import { ClimateProvider } from "./climate/ClimateContext";
import { AudioProvider } from "./audio/AudioContext";
import { GeoProvider } from "./geo/GeoContext";
import { NetworkingProvider } from "./networking/NetworkingContext";
import { PowerProvider } from "./power/PowerContext";
import { AroundMeProvider } from "./aroundMe/AroundMeContext";

function App() {
    const {atTheVan} = React.useContext(AppContext);
    const darkMode = useThemeDetector();

    return (
        <ThemeProvider theme={darkMode ? themeDark : theme}>
            <UserProvider>
                <Box
                    color='text'
                    bg='background'
                    width="100%"
                    minHeight="100vh"
                >

                
                    {atTheVan && 
                    <SocketAuthenticator>
                        <ClimateProvider>
                        <AudioProvider>
                        <GeoProvider>
                        <NetworkingProvider>
                        <PowerProvider>
                        <AroundMeProvider>
                            <AtTheVan />
                        </AroundMeProvider>
                        </PowerProvider>
                        </NetworkingProvider>
                        </GeoProvider>
                        </AudioProvider>
                        </ClimateProvider>
                    </SocketAuthenticator>}


                    {!atTheVan &&       
                        <NotAtTheVan />
                        }
                

                </Box>
            </UserProvider>
        </ThemeProvider>
    );
}

export default App;
