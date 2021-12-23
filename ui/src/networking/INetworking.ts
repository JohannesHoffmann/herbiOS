export enum CellularConnectionStatus {
    connecting = "Connecting",
    connected = "Connected",
    disconnecting = "Disconnecting",
    disconnected = "Disconnected",
    failed = "Connection failed or disabled"
}

export interface ICellularStatus {
    maxSignal: number;
    connectionStatus: CellularConnectionStatus;
    currentNetworkType: string;
}

export interface INetworkingConfig {
    wifi: boolean;
    cellular: boolean;
    cellularStatus: ICellularStatus
}

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