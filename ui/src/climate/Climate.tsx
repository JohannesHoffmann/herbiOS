import React, { useEffect, useState } from "react";
import { Box, Heading, Flex, Text } from "rebass";
import Fans from "../fans/Fans";
import LightsLoader from "../lights/Lights";
import { SubTopic, Topic } from "../utils/IMqtt";
import { useMqttPublish } from "../utils/useMqttPublish";
import { useMqttSubscription } from "../utils/useMqttSubscription";
import HeaterStepButton from "./heater/HeaterSteps";
import { ClimateTopics, IClimateConfiguration, IClimateState } from "./IClimate";


type Props = {
    configuration: IClimateConfiguration;
}

export default function Climate (props: Props) {
    const { configuration } = props;
    
    const [climate, setClimate] = useState<IClimateState>({
        name: configuration.name, 
        unique_id: configuration.unique_id,
        mode: configuration.modes ? configuration.modes[0] as IClimateState["mode"] : "off",
        preset: configuration.preset_modes ? configuration.preset_modes[0] as IClimateState["preset"] : "automatic",
        fanMode: configuration.fan_modes ? configuration.fan_modes[0].toString() : "1",
        temperature: configuration.temperature_initial ? configuration.temperature_initial : 18,
    });

    const publish = useMqttPublish();

    let subscriptions: Array<string> = [
        `${Topic.namespace}/${SubTopic.climate}/${configuration.unique_id}/${ClimateTopics.mode}/${Topic.state}`,
        `${Topic.namespace}/${SubTopic.climate}/${configuration.unique_id}/${ClimateTopics.preset}/${Topic.state}`,
        `${Topic.namespace}/${SubTopic.climate}/${configuration.unique_id}/${ClimateTopics.fanMode}/${Topic.state}`,
        `${Topic.namespace}/${SubTopic.climate}/${configuration.unique_id}/${ClimateTopics.targetTemp}/${Topic.state}`,
        `${Topic.namespace}/${SubTopic.climate}/${configuration.unique_id}/${ClimateTopics.currentTemp}/${Topic.state}`,
    ]; // default state topic of all herbiOs fans

    if (configuration.mode_state_topic) subscriptions.push(configuration.mode_state_topic);
    if (configuration.preset_mode_state_topic) subscriptions.push(configuration.preset_mode_state_topic);
    if (configuration.fan_mode_state_topic) subscriptions.push(configuration.fan_mode_state_topic);
    if (configuration.temperature_state_topic) subscriptions.push(configuration.temperature_state_topic);
    if (configuration.temperature_current_topic) subscriptions.push(configuration.temperature_current_topic);

    const message = useMqttSubscription(subscriptions); 

    // Stuff to do when a new mqtt message arrives
    useEffect(() => {
        if (message?.message) {
            const state = message.message.toString();
            
            setClimate((climateState) => {
                let newState = {...{}, ...climateState};

                // Changes the mode state
                if (
                    (configuration.mode_state_topic && message.topic === configuration.mode_state_topic)
                    || message.topic === `${Topic.namespace}/${SubTopic.climate}/${configuration.unique_id}/${ClimateTopics.mode}/${Topic.state}`
                    ) {
                    newState.mode = state as IClimateState["mode"];
                }
                
                // Changes the preset_mode state
                if (
                    (configuration.preset_mode_state_topic && message.topic === configuration.preset_mode_state_topic)
                    || message.topic === `${Topic.namespace}/${SubTopic.climate}/${configuration.unique_id}/${ClimateTopics.preset}/${Topic.state}`
                    ) {
                    newState.preset = state as IClimateState["preset"];
                }
                
                // Changes the fan_mode state
                if (
                    (configuration.fan_mode_state_topic && message.topic === configuration.fan_mode_state_topic)
                    || message.topic === `${Topic.namespace}/${SubTopic.climate}/${configuration.unique_id}/${ClimateTopics.fanMode}/${Topic.state}`
                    ) {
                    newState.fanMode = state;
                }

                // Changes the temperature state
                if (
                    (configuration.temperature_state_topic && message.topic === configuration.temperature_state_topic)
                    || message.topic === `${Topic.namespace}/${SubTopic.climate}/${configuration.unique_id}/${ClimateTopics.targetTemp}/${Topic.state}`
                    ) {
                    newState.temperature = Number(state);
                }
                
                return newState;
            });
            
        }
    }, [message, setClimate, configuration]);

    const changeMode = (newState: IClimateState) => {
        // Prefer custom set command_topic over default topic
        const commandTopic = configuration.mode_command_topic 
                                                    ? configuration.mode_command_topic
                                                    : `${Topic.namespace}/${SubTopic.climate}/${configuration.unique_id}/${ClimateTopics.mode}/${Topic.set}`;

        setClimate(oldState => {
            if (newState.mode && newState.mode !== oldState.mode) {
                publish(commandTopic, newState.mode);
                return newState;
            }                                   
            return oldState;
        });
    };

    const changePreset = (newState: IClimateState) => {
        // Prefer custom set command_topic over default topic
        const commandTopic = configuration.preset_mode_command_topic 
                                                    ? configuration.preset_mode_command_topic
                                                    : `${Topic.namespace}/${SubTopic.climate}/${configuration.unique_id}/${ClimateTopics.preset}/${Topic.set}`;
        setClimate(oldState => {
            if (newState.preset && newState.preset !== oldState.preset) {
                publish(commandTopic, newState.preset);
                return newState;
            }
            return oldState;
        });  
                             
    };

    const changeFanMode = (newState: IClimateState) => {
        // Prefer custom set command_topic over default topic
        const commandTopicFan = configuration.fan_mode_command_topic 
                                                    ? configuration.fan_mode_command_topic
                                                    : `${Topic.namespace}/${SubTopic.climate}/${configuration.unique_id}/${ClimateTopics.fanMode}/${Topic.set}`;

        const commandTopicMode = configuration.mode_command_topic 
                                                    ? configuration.mode_command_topic
                                                    : `${Topic.namespace}/${SubTopic.climate}/${configuration.unique_id}/${ClimateTopics.mode}/${Topic.set}`;

        setClimate(oldState => {
            if (newState.fanMode && newState.fanMode.toString() !== oldState.fanMode.toString()) {
                publish(commandTopicFan, newState.fanMode);
            }                                  
            
            if (newState.mode && newState.mode !== oldState.mode) {
                publish(commandTopicMode, newState.mode);
            }

            return newState;
        })
    };

    const changeTemperature = (newState: IClimateState) => {
        // Prefer custom set command_topic over default topic
        const commandTopic = configuration.temperature_command_topic 
                                                    ? configuration.temperature_command_topic
                                                    : `${Topic.namespace}/${SubTopic.climate}/${configuration.unique_id}/${ClimateTopics.targetTemp}/${Topic.set}`;
        if (newState.temperature && newState.temperature !== climate.temperature) {
            publish(commandTopic, newState.temperature.toString());     
            setClimate(newState);                       
        }
    };

    return <Box
        variant="tile"
        mt={4}
    >
        <Box
            p={3}
            pr={3}
            pl={3}
            sx={{
                zIndex: 10,
                position: "relative",
            }}
        >
            <Flex alignItems="center">
                <Heading>Heizung</Heading>
                <Box flexGrow={1}><br /></Box>
                <Text 
                    color={climate.preset === "automatic" ? "primary" : "default"} 
                    mr={4}
                    onClick={() => changePreset({...climate, preset: "automatic"})}
                >
                    Automatik
                </Text>
                <Text
                    color={climate.preset === "manual" ? "primary" : "default"} 
                    onClick={() => changePreset({...climate, preset: "manual"})}
                >
                    Manuell
                </Text>
            </Flex>

            {climate.preset === "manual"&& <Box>

                <HeaterStepButton 
                    state={climate.mode === "off" ? "off" : climate.fanMode} 
                    steps={["off", ...configuration.fan_modes ? configuration.fan_modes : []]} 
                    onChange={(state) => { 
                        if (state === "off") {
                            changeMode({...climate, mode: "off"});
                            return;
                        }
                        changeFanMode({...climate, mode: "heat", fanMode: state});
                    }} 
                />
                <Fans inList={["overhead"]} />
            </Box>}

            {climate.preset === "automatic" && <Box>

            <HeaterStepButton 
                    state={climate.mode === "off" ? "off" : climate.temperature + "°C"} 
                    steps={["off", "10°C", "11°C", "12°C", "13°C", "14°C", "15°C", "16°C", "17°C", "18°C", "19°C", "20°C", "21°C", "22°C", "23°C", "24°C", "25°C", "26°C", "27°C", "28°C"]} 
                    onChange={(state) => { 
                        if (state === "off") {
                            changeMode({...climate, mode: "off"});
                            return;
                        }
                        changeTemperature({...climate, mode: "heat", temperature: Number(state[0] + state[1])});
                    }} 
                />

            </Box>}
        </Box>
    </Box>
}