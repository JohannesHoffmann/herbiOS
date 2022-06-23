import React, { useState } from 'react';
import {MdSignalCellularOff, MdSignalCellular4Bar, MdSignalCellular3Bar, MdSignalCellular2Bar, MdSignalCellular1Bar, MdSignalCellular0Bar} from "react-icons/md";
import { Text } from 'rebass';
import { SubTopic, Topic } from '../utils/IMqtt';
import useConfiguration from '../utils/useConfiguration';
import { useMqttPublish } from '../utils/useMqttPublish';
import { IMqttMessage, useMqttSubscription } from '../utils/useMqttSubscription';
import { INetworkingModem, NetworkingTopics } from './INetworking';

export default function Cellular () {
    const modems = useConfiguration<INetworkingModem>(`${Topic.namespace}/${SubTopic.networking}/${NetworkingTopics.modem}/+/${Topic.config}`);

    return <>
        {modems.map(modem => <ModemButton configuration={modem} key={modem.unique_id} />)}
    </>

}

function ModemButton(props: {configuration: INetworkingModem}) {
    const { configuration } = props;
    const [modemState, setModemState] = useState<IMqttMessage>();
    const [signalState, setSignalState] = useState<IMqttMessage>();
    const [networkTypeState, setNetworkTypeState] = useState<IMqttMessage>();

    // Subscribe to ON OFF state of modem
    let subscriptionsModemState: Array<string> = [`${Topic.namespace}/${SubTopic.networking}/${NetworkingTopics.modem}/${configuration.unique_id}/${Topic.state}`];
    if (configuration.state_topic) subscriptionsModemState.push(configuration.state_topic); // use the subscriptionTopics state
    useMqttSubscription((state) => setModemState(state), subscriptionsModemState); 

    // Subscribe to signal strength
    let subscriptionsSignalStength: Array<string> = [`${Topic.namespace}/${SubTopic.networking}/${NetworkingTopics.modem}/${configuration.unique_id}/signal_strength`];
    if (configuration.state_topic) subscriptionsSignalStength.push(configuration.state_topic); // use the subscriptionTopics state
    useMqttSubscription((state) => setSignalState(state), subscriptionsSignalStength); 

    // Subscribe to network service type
    let subscriptionsNetworkType: Array<string> = [`${Topic.namespace}/${SubTopic.networking}/${NetworkingTopics.modem}/${configuration.unique_id}/network_type`];
    if (configuration.state_topic) subscriptionsNetworkType.push(configuration.state_topic); // use the subscriptionTopics state
    useMqttSubscription((state) => setNetworkTypeState(state), subscriptionsNetworkType); 

    const publish = useMqttPublish();

    const change= (on: boolean) => {
        // Prefer custom set command_top over default topic
        const commandTopic = configuration.command_topic 
                                                    ? configuration.command_topic 
                                                    : `${Topic.namespace}/${SubTopic.networking}/${NetworkingTopics.modem}/${configuration.unique_id}/${Topic.set}`;

        publish(commandTopic, on ? "ON" : "OFF");
    };


    let connectionStrength = <MdSignalCellular4Bar />
    switch (signalState?.message) {
        case "4":
            connectionStrength = <MdSignalCellular3Bar />;
            break;
        case "3":
            connectionStrength = <MdSignalCellular2Bar />;
            break;
        case "2":
            connectionStrength = <MdSignalCellular1Bar />;
            break;
        case "1":
            connectionStrength = <MdSignalCellular0Bar />;
            break;
    }
    
    return <Text paddingX={2}>
        {modemState?.message === "ON" && <span onClick={() => { change(false)}}>
            {connectionStrength}
            {networkTypeState?.message}
        </span>}
        {modemState?.message === "OFF" && <MdSignalCellularOff  onClick={() => { change(true)}} />}
    </ Text>
}