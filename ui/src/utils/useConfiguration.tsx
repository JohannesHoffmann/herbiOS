import { useState } from "react";
import { useMqttSubscription } from "../utils/useMqttSubscription";

export default function useConfiguration<T extends {unique_id: string; name: string;}>(topic: string) {
    const [configuration, setConfiguration] = useState<Array<T>>([]);
    useMqttSubscription((message) => {
        if (message && message.message) {
            const config = JSON.parse(message.message) as T;
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
    }, [topic]);

    return configuration;
}