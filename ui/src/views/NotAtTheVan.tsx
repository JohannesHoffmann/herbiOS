import React from "react";
import GeoPositionGroundControl, { ITelemetry } from "../geo/map/GeoPositionGroundControl";
import { Flex, Box, Heading, Button } from "rebass";
import { MdRefresh } from "react-icons/md";
import Axios, { CancelToken } from "axios";
import Config from "../Config";
import { useUserState } from "../contexts/UserContext";


export default function NotAtTheVan() {
    const [telemetries, setTelemetries] = React.useState<Array<ITelemetry>>([]);
    const {authToken} = useUserState();
    const [refreshing, setRefreshing] = React.useState<boolean>(false);
    const refreshTimes = React.useRef(0);
    const [message, setMessage] = React.useState<string>();

    const refresh = async (options?: { cancelToken?: CancelToken}) => {

        refreshTimes.current++;
        try {
            setRefreshing(true);
            setMessage("");
            const data = await Axios.get(Config.groundControl + "/telemetry", {headers: {Authorization: "Bearer " + authToken}, cancelToken: options?.cancelToken});
            setTelemetries(data.data as Array<ITelemetry>);

            setRefreshing(false);
        } catch (e) {
            setRefreshing(false);
        }
    }

    React.useEffect(() => {
        const source = Axios.CancelToken.source();

        if (telemetries.length === 0 && !message && refreshTimes.current <= 0) {
            refresh({cancelToken: source.token});
        }

        return () => {
            source.cancel();
        }
    });

    return <>
        <Flex flexDirection="column" p={20}>

        <Box>

        <Flex flexWrap='wrap' alignItems="stretch">
            <Box p={2} sx={{
                flexGrow: 1,
            }}>
                <Heading fontSize={[ 5, 6, 7 ]} as="h1">Hi!</Heading>
                <Heading fontSize={[ 3, 4, 5 ]} as="h2">Du bist nicht am Van</Heading>
            </Box>
            <Box>
                <Button onClick={() => { refresh(); }}><MdRefresh className={refreshing ? "spin" : ""} /></Button>
            </Box>
        </Flex>

        </Box>
            {message && <Box>
                {message}
            </Box>}

            <Box>



                <Flex flexWrap='wrap' alignItems="stretch">
                    <Box p={2} sx={{width: [ "100%", "100%"], borderRadius: 20, overflow: "hidden", "webkitMaskImage": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC);"}}>
                        <GeoPositionGroundControl telemetries={telemetries} />
                    </Box>
                </Flex>
            </Box>
        </Flex>
        </>
}