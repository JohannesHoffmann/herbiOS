import React from "react";
import { Button, Flex, Text } from "rebass";
import { useWebSocket } from "../../utils/useWebSocket";
import { ITour } from "../ITour";
import Axios from "axios";
import Config from "../../Config";
import { useUserState } from "../../contexts/UserContext";

export default function TourFormButton() {
    const [tour, getTour] = useWebSocket<ITour, string>("activeTour", "/touring");
    const {authToken} = useUserState();

    React.useEffect(() => {
        getTour("");
    }, [getTour])

    const request = async () => {
        // Stop the tour
        if (tour) {
            try {
                await Axios.get(Config.host + "/touring/stop", {headers: {Authorization: "Bearer " + authToken}})
            } catch (e) {
                console.log("Error stopping the tour", tour);
            }
            return;
        }

        //  Start a tour
        try {
            await Axios.get(Config.host + "/touring/just-start", {headers: {Authorization: "Bearer " + authToken}})
        } catch (e) {
            console.log("Error starting a tour", tour);
        }
    }

    return <>
        {!tour && <Button 
                color="green"
                variant="primary"    
            >
                Tour erstellen
            </Button>}

        {tour && <Button 
            color="green"
            sx={{
                backgroundColor: "grey"
            }}
            onClick={request}
            >
                Tour beenden
            </Button>}
    </>

}