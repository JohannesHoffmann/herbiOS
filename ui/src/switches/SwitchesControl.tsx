import React, { useState } from "react";
import { useEffect } from "react";
import { VscPlug } from "react-icons/vsc";
import { Box, Flex } from "rebass";
import SwitchToggle from "../ui/SwitchToggle";
import { SubTopic, Topic } from "../utils/IMqtt";
import { useMqttPublish } from "../utils/useMqttPublish";
import { useMqttSubscription } from "../utils/useMqttSubscription";
import { ISwitchConfiguration, ISwitchState } from "./ISwitch";


type Props = {
    configuration: Array<ISwitchConfiguration>;
}


function SwitchControl(props: Props) {
    const { configuration } = props;

    // MQTT AND LIGHT STATES
    const [subscriptionTopics, setSubscriptionTopics] = useState<Array<string>>([`${Topic.namespace}/${SubTopic.switch}/+/${Topic.state}`,]); // This holds topics to subscribe in a state
    const [switches, setSwitches] = useState<Array<ISwitchState>>(configuration.map(item => ({...item, state: "OFF"}))); // This holds all configurations found via mqtt config
    const publish = useMqttPublish();

    const message = useMqttSubscription(subscriptionTopics); // use the subscriptionTopics state

    // Stuff to do when configuration values are updated from outside this component.
    useEffect(() => {
        setSwitches(configuration.map(item => ({...item, state: "OFF"}))); // reset the available switches
        setSubscriptionTopics([ // Re-Subscribe mqtt topics
            `${Topic.namespace}/${SubTopic.switch}/+/${Topic.state}`, // default state topic of all herbiOs switches
            ...configuration.filter(item => (item?.state_topic ? true : false)).map(item => item.state_topic as string), // filter all switches with custom state_topic paths and subscribe them as well.
        ]);
    }, [configuration]);

    // Stuff to do when a new mqtt message arrives
    useEffect(() => {
        if (message?.message) {
            const state = message.message.toString();

            setSwitches((allSwitches) => {
                // Resolve the switch by matching the topic path
                const foundSwitch = allSwitches.find(item => {
                    // Find either by custom set state_topic
                    if (item.state_topic && message.topic === item.state_topic) {
                        return true;
                    }
                    // or by default topic path
                    if (message.topic === `${Topic.namespace}/${SubTopic.switch}/${item.unique_id}/${Topic.state}`) {
                        return true;
                    }
                    return false;
                });

                // no switch at all so skip processing
                if (!foundSwitch) {
                    return allSwitches;
                }

                // Updates the switches array
                const switchIndex = allSwitches.findIndex(sw => sw.unique_id === foundSwitch.unique_id);
                if (switchIndex >= 0) {
                    const newSwitches = [...[], ...allSwitches];
                    newSwitches[switchIndex].state = state as "ON" | "OFF";
                    return newSwitches;
                }
                

                return allSwitches;
            });
            
        }
    }, [message, setSwitches]);

    // Stuff to do when the value is changed by user input
    // @param value is in percent!
    const changeValue = (sw: ISwitchState) => {
        // Prefer custom set command_top over default topic
        const commandTopic = sw.command_topic 
                                                    ? sw.command_topic 
                                                    : `${Topic.namespace}/${SubTopic.switch}/${sw.unique_id}/${Topic.set}`

        publish(commandTopic, sw.state === "ON" ? "OFF" : "ON");
    };


    if (!switches) {
        return null;
    }
    
    return <Flex
        flexWrap='wrap' 
        alignItems="stretch" 
    >
        
        {switches.map((item) => {
            return <Box p={2} key={item.unique_id} sx={{width: ["50%", "100%"]}}>
                <SwitchToggle
                    label={item.name}
                    value={item.state === "ON" ? true : false}
                    onChange={() => { 
                        changeValue(item);
                    }}
                    icon={<VscPlug />}
                />
            </Box>
        })}
    </Flex>;
}

export default SwitchControl;