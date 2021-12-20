import React from "react";
import { useEffect, useState } from "react";
import { SubTopic, Topic } from "../utils/IMqtt";
import { useMqttSubscription } from "../utils/useMqttSubscription";
import { IFanConfiguration } from "./IFans";
import FanControl from "./FansControl";

type Props = {
    inList?: Array<string>;
}

export default function Fans(props: Props) {
    const { inList } = props;
    const [configuration, setConfiguration] = useState<Array<IFanConfiguration>>([]);
    const message = useMqttSubscription([
        `${Topic.namespace}/${SubTopic.fan}/+/${Topic.config}`,
    ]);

    useEffect(() => {
        if (message && message.message) {
            const config = JSON.parse(message.message) as IFanConfiguration;
            if (
                !config.unique_id ||
                !config.name
            ) return;

            if (inList && !inList.includes(config.unique_id)) return;

            // check if configuration already exists
            setConfiguration((oldConfig) => {
                const index = oldConfig.findIndex(item => item.unique_id === config.unique_id);

                // Add new config
                if (index === -1) {
                    return [
                        ...oldConfig,
                        config,
                    ];
                }

                // Alter existing config
                let newConfig = [...oldConfig];
                newConfig[index] = config;
                return newConfig;
            });
        }
    }, [message, setConfiguration]);

    if (configuration.length === 0) {
        return <>No Fans configured</>;
    }

    return <FanControl configuration={configuration} />;
}