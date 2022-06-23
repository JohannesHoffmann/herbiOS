import React, { useState } from "react";
import { Flex, Text } from "rebass";
import IconBusStart from "../ui/icons/IconBusStart";
import { useWebSocket } from "../utils/useWebSocket";
import { ITour } from "./ITour";
import IconBusStop from "../ui/icons/IconBusStop";
import Axios from "axios";
import Config from "../Config";
import { useUserState } from "../contexts/UserContext";

export default function TourButton() {
    const [tour, setTour] = useState<ITour>();
    const {authToken} = useUserState();
    useWebSocket<ITour, string>((tour) => {
        setTour(tour);
    }, "activeTour", "/touring");

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

    return <Flex
        flexDirection="column"
        alignItems="center"
        onClick={request}
    >
        {!tour && <>
            <IconBusStart color="green" secondary="white" />
            <Text color="green">Starte Tour</Text>
        </>}

        {tour && <>
            <IconBusStop color="green" secondary="white" />
            <Text color="green">Stoppe Tour</Text>
        </>}
    </Flex>
}