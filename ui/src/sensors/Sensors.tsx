import React from "react";
import { useState } from "react";
import { SubTopic, Topic } from "../utils/IMqtt";
import { useMqttSubscription } from "../utils/useMqttSubscription";
import { ISensorConfiguration } from "./ISensors";
import { SensorVariant } from "./Sensor";
import SensorList from "./SensorList";

type Props = {
    inList?: Array<string>;
    variant?: SensorVariant;
}

export default function Sensors(props: Props) {
    const { inList, variant } = props;
    const [configuration, setConfiguration] = useState<Array<ISensorConfiguration>>([]);
    useMqttSubscription((message) => {
        if (message && message.message) {
            const config = JSON.parse(message.message) as ISensorConfiguration;
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
        `${Topic.namespace}/${SubTopic.sensor}/+/${Topic.config}`,
    ]);

    if (configuration.length === 0) {
        if (variant === "small") {
            return null;
        }
        return <>No Sensors configured</>;
    }

    return <SensorList configuration={configuration} variant={variant} />;
}