import Modem from 'hilink-modem';
import { CellularConnectionStatus, ICellularStatus } from "./NetworkingConfig";

class Cellular {

    isOn: boolean;

    public async connect() {
        this.isOn = true;
        const modem = new Modem({
            modemIp: "192.168.8.1",
        });
        const result = await modem.connect();

        console.log("Connect to cellular", result);
        return result;
    }

    public async disconnect() {
        this.isOn = false;
        const modem = new Modem({
            modemIp: "192.168.8.1",
        });
        
        const result = await modem.disconnect();

        console.log("Disconnect from cellular", result);

        return result;
    }

    public async status(): Promise<ICellularStatus> {
        const modem = new Modem({
            modemIp: "192.168.8.1",
        });

        try {
            const status = await modem.status();

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
    
    
            console.log("Modem Status", status);
            // status.CurrentConnectTime
            // status.CurrentDownload
            // status.CurrentDownloadRate
            // status.CurrentUpload
            // status.CurrentUploadRate
            // status.TotalConnectTime
            // status.TotalUpload
            // status.showtraffic
    
            // const statistics = modem.
    
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

export default Cellular;