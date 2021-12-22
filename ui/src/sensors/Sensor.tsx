import React, { useState } from "react";
import { useEffect } from "react";
import { Box, Flex, Text } from "rebass";
import { SubTopic, Topic } from "../utils/IMqtt";
import { useMqttSubscription } from "../utils/useMqttSubscription";
import { ISensorConfiguration, ISensorState } from "./ISensors";
import {BsThermometerHalf, BsBatteryHalf } from "react-icons/bs";

export type SensorVariant = "small" | "normal";

type Props = {
    configuration: ISensorConfiguration;
    variant?: SensorVariant;
}


function Sensor(props: Props) {
    const { configuration, variant } = props;
    const [sensor, setSensor] = useState<ISensorState>({
        state: "", 
        name: configuration.name, 
        unique_id: configuration.unique_id
    });

    let subscriptions: Array<string> = [`${Topic.namespace}/${SubTopic.sensor}/${configuration.unique_id}/${Topic.state}`] // default state topic of all herbiOs sensors
    if (configuration.state_topic) subscriptions.push(configuration.state_topic); // use the subscriptionTopics state
    const message = useMqttSubscription(subscriptions); 

    // Stuff to do when a new mqtt message arrives
    useEffect(() => {
        if (message?.message) {
            const state = message.message.toString();
            
            setSensor((sensorState) => {
                let newState = {...{}, ...sensorState};

                // Changes the main state
                if (
                    (configuration.state_topic && message.topic === configuration.state_topic)
                    || message.topic === `${Topic.namespace}/${SubTopic.sensor}/${configuration.unique_id}/${Topic.state}`
                    ) {
                    newState.state = state;
                }
                
                return newState;
            });
            
        }
    }, [message, setSensor, configuration]);

    let icon = null;
    switch(configuration.icon) {
        case "battery":
            icon = <BsBatteryHalf />
            break;

        case "thermometer":
            icon = <BsThermometerHalf />;
            break;
    }

    if (variant === "small") {
        return <Text paddingX={2}>
            {icon}
            {sensor.state}
            {configuration.unit_of_measurement}
        </ Text>
    }
    
    return <Box>
        <Flex
            fontSize={4}
            height="100%"
        >
            {icon && <Box pr={1}>
                {icon}
            </Box>}
            <Text 
                fontSize={[3, 3,]} 
                flexGrow={1}
                
            >
                {configuration.name}
            </Text>
            <Text>
                {sensor.state} 
                {configuration.unit_of_measurement}
            </Text>
        </Flex>
        
    </Box>
}

export default Sensor;