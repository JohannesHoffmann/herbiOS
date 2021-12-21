import { useEffect, useState } from "react";
import { SubTopic, Topic } from "../utils/IMqtt";
import { useMqttSubscription } from "../utils/useMqttSubscription";
import { IGeo } from "./IGeo";


export function useGeoState(): IGeo {
    const [geo, setGeo] = useState<IGeo>({
        status: 0,
        dateTime: new Date,
        lat: 0,
        lon: 0,
        headingDeviation: "",
        speed: 0,
        altitude: 0,
        satellites: 0,
    });

    const message = useMqttSubscription([
        `${Topic.namespace}/${SubTopic.geoPosition}/${Topic.state}`,
    ]);

    useEffect(() => {
        if (message && message.message) {
            const newGeo = JSON.parse(message.message) as IGeo;
            setGeo(newGeo);
        }
    }, [message, setGeo])


    return geo;
}
