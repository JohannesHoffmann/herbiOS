import React from 'react';
import {BiWifi, BiWifiOff} from "react-icons/bi";
import { Text } from 'rebass';
import { SubTopic, Topic } from '../utils/IMqtt';
import useConfiguration from '../utils/useConfiguration';
import { useMqttPublish } from '../utils/useMqttPublish';
import { useMqttSubscription } from '../utils/useMqttSubscription';
import { INetworkingInterface, NetworkingTopics } from './INetworking';

export default function Wifi () {
    const wifis = useConfiguration<INetworkingInterface>(`${Topic.namespace}/${SubTopic.networking}/${NetworkingTopics.interface}/+/${Topic.config}`);

    return <>
        {wifis.map(wifi => <WifiButton configuration={wifi} key={wifi.unique_id} />)}
    </>
}

function WifiButton(props: {configuration: INetworkingInterface}) {
    const { configuration } = props;
    let subscriptions: Array<string> = [`${Topic.namespace}/${SubTopic.networking}/${NetworkingTopics.interface}/${configuration.unique_id}/${Topic.state}`];
    if (configuration.state_topic) subscriptions.push(configuration.state_topic); // use the subscriptionTopics state
    const message = useMqttSubscription(subscriptions); 
    const publish = useMqttPublish();

    const changeWifi= (on: boolean) => {
        // Prefer custom set command_top over default topic
        const commandTopic = configuration.command_topic 
                                                    ? configuration.command_topic 
                                                    : `${Topic.namespace}/${SubTopic.networking}/${NetworkingTopics.interface}/${configuration.unique_id}/${Topic.set}`;

        publish(commandTopic, on ? "ON" : "OFF");
    };

return <Text paddingX={2}>
    {message?.message === "ON" && <BiWifi onClick={() => { changeWifi(false)}} />}
    {!message?.message || message?.message === "OFF"  && <BiWifiOff  onClick={() => { changeWifi(true)}} />}
</ Text>
}