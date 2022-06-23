import React from "react";
import { useState } from "react";
import { SubTopic, Topic } from "../utils/IMqtt";
import { useMqttSubscription } from "../utils/useMqttSubscription";
import ClimateList from "./ClimateList";
import { IClimateConfiguration } from "./IClimate";

type Props = {
    inList?: Array<string>;
}

export default function Climates(props: Props) {
    const { inList } = props;
    const [configuration, setConfiguration] = useState<Array<IClimateConfiguration>>([]);
    useMqttSubscription((message) => {
        if (message && message.message) {
            const config = JSON.parse(message.message) as IClimateConfiguration;
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
    }, [
        `${Topic.namespace}/${SubTopic.climate}/+/${Topic.config}`,
    ]);

    if (configuration.length === 0) {
        return <>No Climates configured</>;
    }

    return <ClimateList configuration={configuration} />;
}