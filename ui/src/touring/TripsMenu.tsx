import React from "react";
import { useUserState } from "../contexts/UserContext";
import List from "../ui/list/List";
import ListHeader from "../ui/list/ListHeader";
import { ITour } from "./ITour";
import TripsListMini from "./listing/TripsListMini";
import Axios, { CancelToken } from "axios";
import Config from "../Config";
import Slider from "../ui/slider/Slider";
import TourForm from "./TourForm";

type Props = {

}

export default function TripsMenu (props: Props) {
    const [tours, setTours] = React.useState<Array<ITour>>([]);
    const loaded = React.useRef(false);
    const {authToken} = useUserState();
    const [selectedTour, setSelectedTour] = React.useState<number>();

    const refresh = async (token?: CancelToken) => {
        loaded.current = true;
        try {
            const data = await Axios.get<Array<ITour>>(Config.host+ "/touring/tours", {headers: {Authorization: "Bearer " + authToken}, cancelToken: token});
            if (data.data) {
                setTours(data.data);
            }
        } catch (e) {
            console.log("Error loading tours list", e);
        }
    }

    React.useEffect(() => {
        const source = Axios.CancelToken.source();
        if (!loaded.current) {
            refresh(source.token);
        }
        return () => {
            source.cancel();
        }
    });

    return <List>
    <ListHeader>
        Trips
    </ListHeader>

    <TripsListMini 
        tours={tours.slice(-3).sort((a, b) => (new Date(a.startTime) < new Date(b.startTime) ? 1 : -1))} 
        onSelect={(id: number) => { setSelectedTour(id) }}
    />

    <Slider 
        open={selectedTour !== undefined} 
        onClose={() => { 
            setSelectedTour(undefined); 
            loaded.current = false;
        }}
        label={"Tour"}
        subSlider={true}
    >
        <TourForm tourId={selectedTour} />
    </Slider>
</List>

}