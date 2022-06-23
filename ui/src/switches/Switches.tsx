import React from "react";
import { useState } from "react";
import { SubTopic, Topic } from "../utils/IMqtt";
import { useMqttSubscription } from "../utils/useMqttSubscription";
import { ISwitchConfiguration } from "./ISwitch";
import SwitchControl from "./SwitchesControl";

export default function Switches() {
    const [configuration, setConfiguration] = useState<Array<ISwitchConfiguration>>([]);
    
    useMqttSubscription((message) => {
        if (message && message.message) {
            const config = JSON.parse(message.message) as ISwitchConfiguration;
            if (
                !config.unique_id ||
                !config.name
            ) return;
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
        `${Topic.namespace}/${SubTopic.switch}/+/${Topic.config}`,
    ]);

    if (configuration.length === 0) {
        return <>No Switches configured</>;
    }

    return <SwitchControl configuration={configuration} />;
}