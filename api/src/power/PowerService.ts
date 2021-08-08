import SocketService from "../api/websocket/SocketService";
import SerialService from "../SerialService";
import PowerConfig, { IPowerConfig } from "./PowerConfig";
import PowerSocket from "./PowerSocket";
import Solar from "./Solar";

class PowerService {

    private static instance: PowerService;

    public static getInstance(): PowerService {
        if (!PowerService.instance) {
            PowerService.instance = new PowerService();
        }
        return PowerService.instance;
    }

    private _config: PowerConfig;
    private _socket: PowerSocket;
    private _solar: Solar;

    private constructor() {
        this._config = new PowerConfig();
        this._socket = SocketService.getInstance().getNamespace("power");
        this._solar = new Solar();

    }

    private _update() {
        this._socket.updateStatus(this._config.get());
    }

    public getConfig(): IPowerConfig {
        return this._config.get();
    }

    public setSwitch(name: keyof IPowerConfig["switches"], on: boolean) {
        switch (name) {
            case "inverter":
                SerialService.send("setSwitch -name 230V -mode " + (on ? "on" : "off"));
                break;
                
            default:
                SerialService.send("setSwitch -name " + name + " -mode " + (on ? "on" : "off"));
                break;
        }

        this._config.set({
            switches: {
                ...this._config.get().switches,
                [name]: on,
            }
        });
        this._config.save();
        this._update();
    }


}

export default PowerService;