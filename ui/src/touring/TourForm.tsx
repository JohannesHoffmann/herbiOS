import React from "react";
import { Box, Button, Flex, Heading, Text } from "rebass";
import { ITour, ITourPackage } from "./ITour";
import PoiList from "./pois/PoiList";
import TourMap, { TourMapProps } from "./TourMap";
import {format}  from "date-fns";
import { de } from 'date-fns/locale'
import { useUserState } from "../contexts/UserContext";
import Axios from "axios";
import Config from "../Config";
import SingleLineEdit from "../ui/form/SingleLineEdit";
import MultiLineEdit from "../ui/form/MultiLineEdit";
import IconCalendar from "../ui/icons/IconCalendar";

type Props = {
    tourId?: number;
    propsMap?: TourMapProps;
    onTourClose?: () => void;
}

export default function TourForm(props: Props) {
    const {tourId, propsMap, onTourClose} = props;
    const [tour, setTour] = React.useState<ITourPackage>();
    const loaded = React.useRef(false);
    const {authToken} = useUserState();

    React.useEffect(() => {
        const source = Axios.CancelToken.source();

        const refresh = async () => {
            loaded.current = true;
            try {
                const data = await Axios.get<ITourPackage>(Config.host+ "/touring/tour/" + tourId, {headers: {Authorization: "Bearer " + authToken}, cancelToken: source.token});
                if (data.data) {
                    setTour(data.data);
                }
            } catch (e) {
                console.log("Error loading tour", e);
            }
        }

        if (!loaded.current && tourId !== undefined) {
            refresh();
        } else {
            loaded.current = true;
            setTour({
                tour: {
                    id: -1,
                    name: "New Tour",
                    startTime: new Date(),
                },
                route: [],
                pois: [],
            });
        }

        return () => {
            source.cancel();
        }
    }, [tourId, authToken]);

    const changeTour = async (tourUpdate: Partial<ITour>) => {
        setTour({
            ...tour ? tour : {route: [], pois: [],},
            tour: {
                ...tour?.tour ? tour.tour : {
                    id: -1,
                    name: "New Tour",
                    startTime: new Date(),
                }, 
                ...tourUpdate,
            }
        });
        
        if (!tourId) {
            return;
        }

        try {
            await Axios.put<Partial<ITour>>(
                Config.host+ "/touring/tour/" + tourId, 
                tourUpdate,
                {headers: {Authorization: "Bearer " + authToken}}
            );
        } catch (e) {
            console.log("Error updating tour", e);
        }
    }


    const stopTour = async () => {
        // Stop the tour
        if (tour) {
            try {
                await Axios.get(Config.host + "/touring/stop", {headers: {Authorization: "Bearer " + authToken}});
                if (onTourClose) onTourClose();
            } catch (e) {
                console.log("Error stopping the tour", tour);
            }
            return;
        }
    }


    const startTour = async () => {
        // Start a new Tour
        if (tour) {
            try {
                await Axios.post(
                    Config.host + "/touring/tour", 
                    {name: tour.tour.name, description: tour.tour.description},
                    {headers: {Authorization: "Bearer " + authToken}})
            } catch (e) {
                console.log("Error starting a tour", tour);
            }
            return;
        }
    }


    return <>
        <Box mb={4}>

            {tour && tour.tour.name && <SingleLineEdit
                value={tour.tour.name}
                Wrapper={<Heading fontSize={5} />}
                onChange={(name: string) => changeTour({name})}
            />}



            <Flex mb={3}>
                <Box mr={2}>
                    <IconCalendar color="primary" width={18} />
                </Box>
                <Box flexGrow={1}>
                    {tour && tour.tour.startTime && <Text>{format(new Date(tour.tour.startTime), "EEEE, dd. MMM yyyy", {locale: de})}</Text>}
                    {tour && tour.tour.endTime && <Text>- {format(new Date(tour.tour.endTime), "EEEE, dd. MMM yyyy", {locale: de})}</Text>}
                </Box>
            </Flex>

            <Box mt={4}>
                <MultiLineEdit
                    value={tour?.tour.description}
                    addText="Tourenbeschreibung hinzufügen +"
                    Wrapper={<Text />}
                    onChange={(description: string) => changeTour({description})}
                />
            </Box>
        </Box>

        {tour?.pois && <Box mb={2}>
            <PoiList pois={tour.pois} />
        </Box>}

        <TourMap {...propsMap} route={tour?.route} pois={tour?.pois} />

        <Flex
            sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 400,
            }}
            p={4}
            pt={0}
            justifyContent="center"
        >
            {!tourId && <Button
                onClick={startTour}
            >
                Tour erstellen
            </Button>}
            {tourId && tour && !tour.tour.endTime && <Button
                    sx={{
                        backgroundColor: "grey",
                    }}
                    onClick={stopTour}
                >
                    Tour stoppen
                </Button>}
        </Flex>
    </>
}