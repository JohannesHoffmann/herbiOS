import JsonConfig from "../api/file/JsonConfig";

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

export default class NetworkingConfig extends JsonConfig<INetworkingConfig> {

    constructor() {
        super("networking.json");
        this._content = {
            wifi: true,
            cellular: false,
            cellularStatus: {
                maxSignal: 0,
                connectionStatus: CellularConnectionStatus.disconnected,
                currentNetworkType: "LTE",
            }
        }

        this.load();
    }

}