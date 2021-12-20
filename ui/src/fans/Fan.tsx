import { Slider } from "@rebass/forms";
import { useTheme } from "emotion-theming";
import React, { useState } from "react";
import { useEffect } from "react";
import { FaFan } from "react-icons/fa";
import { Box, Button, Flex, SxStyleProp, Text } from "rebass";
import IconArrowDouble from "../ui/icons/IconArrowDouble";
import IconArrowLeft from "../ui/icons/IconArrowLeft";
import IconArrowRight from "../ui/icons/IconArrowRight";
import SwitchToggle from "../ui/SwitchToggle";
import { SubTopic, Topic } from "../utils/IMqtt";
import { useMqttPublish } from "../utils/useMqttPublish";
import { useMqttSubscription } from "../utils/useMqttSubscription";
import { FanTopics, IFanConfiguration, IFanState } from "./IFans";


type Props = {
    configuration: IFanConfiguration;
}


function Fan(props: Props) {
    const { configuration } = props;
    const theme: any= useTheme();
    const [fan, setFan] = useState<IFanState>({
        state: "OFF", 
        name: configuration.name, 
        unique_id: configuration.unique_id
    });

    const publish = useMqttPublish();

    let subscriptions: Array<string> = [`${Topic.namespace}/${SubTopic.fan}/${configuration.unique_id}/${Topic.state}`] // default state topic of all herbiOs fans
    if (configuration.state_topic) subscriptions.push(configuration.state_topic); // use the subscriptionTopics state
    if (configuration.speed) subscriptions.push(`${Topic.namespace}/${SubTopic.fan}/${configuration.unique_id}/${FanTopics.speed}/${Topic.state}`)
    if (configuration.speed && configuration.speed_state_topic) subscriptions.push(configuration.speed_state_topic);
    if (configuration.preset_modes) subscriptions.push(`${Topic.namespace}/${SubTopic.fan}/${configuration.unique_id}/${FanTopics.preset}/${Topic.state}`)
    if (configuration.preset_modes && configuration.preset_mode_state_topic) subscriptions.push(configuration.preset_mode_state_topic);
    const message = useMqttSubscription(subscriptions); 

    // Stuff to do when a new mqtt message arrives
    useEffect(() => {
        if (message?.message) {
            const state = message.message.toString();
            
            setFan((fanState) => {
                let newState = {...{}, ...fanState};

                // Changes the main state
                if (
                    configuration.state_topic && message.topic === configuration.state_topic
                    || message.topic === `${Topic.namespace}/${SubTopic.fan}/${configuration.unique_id}/${Topic.state}`
                    ) {
                    newState.state = state as "ON" | "OFF";
                }
                
                // Changes the speed state
                if (
                    configuration.speed_state_topic && message.topic === configuration.speed_state_topic
                    || message.topic === `${Topic.namespace}/${SubTopic.fan}/${configuration.unique_id}/${FanTopics.speed}/${Topic.state}`
                    ) {
                    newState.speed = Number(state);
                }
                
                // Changes the preset_mode state
                if (
                    configuration.preset_mode_state_topic && message.topic === configuration.preset_mode_state_topic
                    || message.topic === `${Topic.namespace}/${SubTopic.fan}/${configuration.unique_id}/${FanTopics.preset}/${Topic.state}`
                    ) {
                    newState.preset_mode= state;
                }
                
                return newState;
            });
            
        }
    }, [message, setFan]);

    // Stuff to do when the value is changed by user input
    const changeValueMain = (sw: IFanState) => {
        // Prefer custom set command_topic over default topic
        const commandTopic = configuration.command_topic 
                                                    ? configuration.command_topic 
                                                    : `${Topic.namespace}/${SubTopic.fan}/${configuration.unique_id}/${Topic.set}`

        publish(commandTopic, sw.state);
    };

    const changePreset = (sw: IFanState) => {
        if (sw.state === "OFF") return;
        // Prefer custom set command_topic over default topic
        const commandTopic = configuration.preset_mode_command_topic 
                                                    ? configuration.preset_mode_command_topic
                                                    : `${Topic.namespace}/${SubTopic.fan}/${configuration.unique_id}/${FanTopics.preset}/${Topic.set}`;
        if (sw.preset_mode) {
            publish(commandTopic, sw.preset_mode);
        }                                   
    };

    const changeSpeed = (sw: IFanState) => {
        if (sw.state === "OFF") return;
        // Prefer custom set command_topic over default topic
        const commandTopic = configuration.speed_command_topic 
                                                    ? configuration.speed_command_topic
                                                    : `${Topic.namespace}/${SubTopic.fan}/${configuration.unique_id}/${FanTopics.speed}/${Topic.set}`;
        if (sw.speed) {
            publish(commandTopic, sw.speed.toString());
        }                                   
    };


    const buttonStyle: SxStyleProp = {
        marginRight: 2,
        padding: 3,
        width: "28%",
        backgroundColor: "background",
        color: "lightGrey",

    }

    const buttonStyleActive: SxStyleProp = {
        ...buttonStyle,
        backgroundColor: "primary",
        color: "white"
    }
    
    return <Box>
        <SwitchToggle
            label={configuration.name}
            value={fan.state === "ON" ? true : false}
            onChange={() => { 
                changeValueMain({...fan, state: fan.state === "ON" ? "OFF" : "ON"});
            }}
            icon={<FaFan />}
        />

        {configuration.preset_modes && <Flex justifyContent="space-between">
            {configuration.preset_modes.map(mode => <Button 
                key={mode}
                sx={{    
                    ...fan.state === "ON" && mode === fan.preset_mode ? buttonStyleActive : buttonStyle,
                }}
                onClick={() => { changePreset({...fan, preset_mode: mode}) }}
            >
                {mode === "in" && <IconArrowRight width={30}  color={fan.state === "ON" && fan.preset_mode === "in" ? "white" : "lightGrey"} />}
                {mode === "out" && <IconArrowLeft width={30}  color={fan.state === "ON" && fan.preset_mode=== "out" ? "white" : "lightGrey"} />}
                {mode === "inOut" && <IconArrowDouble width={30}  color={fan.state === "ON" && fan.preset_mode === "inOut" ? "white" : "lightGrey"} />}
                <Text>
                    {mode}
                </Text>
            </Button>)}
        </Flex>}

        {configuration.speed && fan.speed && <Slider
            id='percent'
            name='percent'
            value={fan.speed}
            onChange={(e: any) => changeSpeed({...fan, speed: Number(e.currentTarget.value)})}
            disabled={fan.state === "OFF"}
            sx={{
                height: 5,
                background: fan.state === "OFF" ?
                    `${theme.colors.backgroundLight}` :
                    `linear-gradient(to right, ${theme.colors.primary} 0%,${theme.colors.primary} ${fan.speed}%, ${theme.colors.primary}80 ${fan.speed}%, ${theme.colors.primary}80 100%);`,
                "&::-webkit-slider-thumb": {
                    bg: fan.state === "OFF" ? theme.colors.grey : "primary",
                    width: 16,
                    height: 16,
                },
                "&::-moz-range-thumb" : {
                    bg: fan.state === "OFF" ? theme.colors.grey : "primary",
                    border: 0,
                    width: 16,
                    height: 16,
                }
            }}
        />}
    </Box>
}

export default Fan;