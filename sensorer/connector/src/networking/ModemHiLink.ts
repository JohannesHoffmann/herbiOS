import Modem from 'hilink-modem';
import ConfigService from '../ConfigService';

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

class ModemHiLink {

    private _modem: Modem;
    private _env: string = "productive";

    constructor(private _ip: string) {
        const { env } = ConfigService.getInstance().getConfig();
        this._env = env;

        if (env !== "development") {
            this._modem =  new Modem({
                modemIp: this._ip,
            });
        }

    }

    

    isOn: boolean;

    public async connect() {
        this.isOn = true;
        
        if (this._env === "development") {
            return;
        } 

        const result = await this._modem.connect();
        console.log("Connect to cellular", result);
        return result;
    }

    public async disconnect() {
        this.isOn = false;

        if (this._env === "development") {
            return;
        } 

        const result = await this._modem.disconnect();
        console.log("Disconnect from cellular", result);
        return result;
    }

    public async status(): Promise<ICellularStatus> {
        

        if (this._env === "development") {
            return {
                maxSignal: Math.round(5 * Math.random()),
                currentNetworkType: "LTE",
                connectionStatus: CellularConnectionStatus.connected,
            }
        } 


        try {
            const status = await this._modem.status();

            let connectionStatus: CellularConnectionStatus = CellularConnectionStatus.disconnected;
            switch (status["ConnectionStatus"]) {
                case 900:
                    connectionStatus = CellularConnectionStatus.connecting;
                case 901:
                    connectionStatus = CellularConnectionStatus.connected;
                case 902:
                    connectionStatus = CellularConnectionStatus.disconnected;
                case 903:
                    connectionStatus = CellularConnectionStatus.disconnecting;
                case 904:
                    connectionStatus = CellularConnectionStatus.failed;
            }
    
            let networkType: string = "n/a";
            switch (status["CurrentNetworkType"]) {
                case 0:
                    networkType = "No Service";
                case 1:
                    networkType = "GSM";
                case 2:
                    networkType = "GPRS (2.5G)";
                case 3:
                    networkType = "EDGE (2.75G)";
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 41:
                case 44:
                case 45:
                case 46:
                case 64:
                case 65:
                    networkType = "3G";
                case 9:
                case 19:
                case 101:
                    networkType = "LTE";
            }
    
            return {
                maxSignal: status["SignalIcon"],
                connectionStatus,
                currentNetworkType: networkType,
            }
        } catch (e) {
            console.log(e);
        }
        
    }

}

export default ModemHiLink;