import SocketService from "../api/websocket/SocketService";
import Cellular from "./Cellular";
import NetworkingConfig, { INetworkingConfig } from "./NetworkingConfig";
import NetworkingSocket from "./NetworkingSocket";
import Wifi from "./Wifi";

class NetworkingService {

    private static instance: NetworkingService;

    public static getInstance(): NetworkingService {
        if (!NetworkingService.instance) {
            NetworkingService.instance = new NetworkingService();
        }
        return NetworkingService.instance;
    }

    private _config: NetworkingConfig;
    private _socket: NetworkingSocket;
    private _wifi: Wifi;
    private _cellular: Cellular;

    private constructor() {
        this._config = new NetworkingConfig();
        this._socket = SocketService.getInstance().getNamespace("networking");
        this._wifi = new Wifi();
        this._cellular = new Cellular();

    }

    private _update() {
        this._socket.updateStatus(this._config.get());
    }

    wifiOn(on: boolean = true) {
        this._wifi.on(on);
        this._config.set({wifi: on});
        this._config.save();
        this._update();
    }

    wifiOff() {
        this._wifi.off();
        this._config.set({wifi: false});
        this._config.save();
        this._update();
    }

    async cellularConnect() {
        this._config.set({cellular: true});
        this._config.save();
        this._update();
        const result =  await this._cellular.connect();
        return result;
    }

    async cellularDisconnect() {
        this._config.set({cellular: false});
        this._config.save();
        this._update();
        const result = await this._cellular.disconnect();
        return result;
    }

    /**
     * requests system status of the networking interfaces
     */
    async status() {
        // Cellular status
        this._cellular.status();

        // WIFI Stauts
        this._wifi.status();
    }

    public getConfig(): INetworkingConfig {
        return this._config.get();
    }


}

export default NetworkingService;