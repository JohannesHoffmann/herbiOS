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