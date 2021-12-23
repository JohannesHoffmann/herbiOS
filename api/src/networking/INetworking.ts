export interface INetworkingInterface {
    name: string;
    unique_id: string;

    command_topic?: string;
    state_topic?: string;

    signal_strength_state_topic?: string;
}

export interface INetworkingModem {
    name: string;
    unique_id: string;
    ip: string;
    command_topic?: string;
    state_topic?: string;

    signal_strength_state_topic?: string;
    network_type_state_topic?: string;
}

export enum NetworkingTopics {
    interface = "interface",
    modem = "modem"
}