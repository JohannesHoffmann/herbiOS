import React from "react";
import GeoPositionGroundControl from "../geo/map/GeoPositionGroundControl";
import { Flex, Box, Heading, Button, Text } from "rebass";
import { MdRefresh } from "react-icons/md";
import Axios, { CancelToken } from "axios";
import Config from "../Config";
import { useUserState } from "../contexts/UserContext";
import { IGeo } from "../geo/IGeo";
import {BsThermometerHalf, BsBatteryHalf } from "react-icons/bs";
import {format}  from "date-fns";
import { de } from 'date-fns/locale'

export interface ITelemetry {
    dateTime: Date;
    position: IGeo,
    sensors: Array<ISensorData>,
}

export interface ISensorData {
    name: string;
    unique_id: string;
    icon?: "thermometer" | "battery";
    unit_of_measurement?: string;
    value: string | number | boolean;
    changedAt: Date;
}

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
            const data = await Axios.get<Array<ITelemetry>>(Config.groundControl + "/telemetry", {headers: {Authorization: "Bearer " + authToken}, cancelToken: options?.cancelToken});
            setTelemetries(data.data.reverse());

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

    let lastMotionDetect: ISensorData;
    telemetries.find(log => {
        const sensor = log.sensors.find(sensor => sensor.unique_id === "motionDetect");

        if (!sensor) return false;
        if (sensor.value.toString().startsWith("true")) {
            lastMotionDetect = sensor;
            return true;
        }
        return false;
    });

    return <>
        <Flex flexDirection="column" p={20}>

        <Box>

        <Flex flexWrap='wrap' alignItems="stretch">
            <Box p={2} sx={{
                flexGrow: 1,
                mb: 4,
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

                <Box>

                    {telemetries.length > 0 && telemetries[0].sensors && telemetries[0].sensors.map(sensor => {

                            let icon = null;
                            switch(sensor.icon) {
                                case "battery":
                                    icon = <BsBatteryHalf />
                                    break;

                                case "thermometer":
                                    icon = <BsThermometerHalf />;
                                    break;
                            }

                        return <Box mb={2}>
                        <Flex
                            fontSize={4}
                            height="100%"
                        >
                            {icon && <Box pr={1}>
                                {icon}
                            </Box>}
                            <Text 
                                fontSize={[3]} 
                                flexGrow={1}
                            >
                                {sensor.name}
                            </Text>
                            <Text
                                fontSize={[3]}
                            >
                                {sensor.value}
                                {sensor.unit_of_measurement}
                            </Text>
                        </Flex>
                        

                        {sensor.unique_id.startsWith("motion") && lastMotionDetect && <Flex>
                            <Text 
                                fontSize={[2]} 
                                flexGrow={1}
                            >
                                 Letzte Bewegung: 
                            </Text>
                            <Text
                                fontSize={[2]}
                            >
                                {format(new Date(lastMotionDetect.changedAt), "dd.MM.yyyy HH:mm", {locale: de})}
                            </Text>
                           
                        </Flex>}

                    </Box>
                    })}

                </Box>

                <Flex flexWrap='wrap' alignItems="stretch">
                    <Box p={2} sx={{width: [ "100%", "100%"], borderRadius: 20, overflow: "hidden", "webkitMaskImage": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC);"}}>
                        <GeoPositionGroundControl telemetries={telemetries} />
                    </Box>
                </Flex>
            </Box>
        </Flex>
        </>
}