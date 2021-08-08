import NamespaceSocket from "../api/websocket/NamespaceSocket";
import { Socket, Server} from "socket.io";
import { IClimateConfig } from "./ClimateConfig";
import { HeaterMode, HeaterStrength } from "./Heater";
import ClimateService from "./ClimateService";
import { FanMode } from "./Fan";

 type  ClimateEventsListen = {
     ["status"]: () => void,
     ["heater:change"]: (set: {mode?: HeaterMode, strength?: HeaterStrength }) => void,
     ["fan:change"]: (set: {mode?: FanMode, strength?: number }) => void,
    }
    
    type  ClimateEventsEmit = {
     ["status"]: (status: IClimateConfig) => void,
 }

/**
 * Class to send herp system events over the socket server under the /events namespace
 *
 * @export
 * @class LightsSocket
 * @extends {NamespaceSocket}
 */
export default class ClimateSocket extends NamespaceSocket {

    constructor(ws: Server<ClimateEventsListen, ClimateEventsEmit>) {
        super(ws, "/climate");
    }

    protected _socket(socket: Socket<ClimateEventsListen, ClimateEventsEmit>) {
        socket.emit("status", ClimateService.getInstance().getConfig());

        // Request lights
        socket.on("status", () => {
            socket.emit("status", ClimateService.getInstance().getConfig());
        });

        // Request heater settings for manual
        socket.on("heater:change", (message) => {
            ClimateService.getInstance().setHeaterManual(message);
            let config: IClimateConfig = ClimateService.getInstance().getConfig();
            config.heater = {
                ...config.heater,
                ...message,
            };
            this._ws.emit("status", config);
        });

        // Request heater settings for manual
        socket.on("fan:change", (message) => {
            ClimateService.getInstance().setFanManual(message);
            let config: IClimateConfig = ClimateService.getInstance().getConfig();
            config.fan = {
                ...config.fan,
                ...message,
            };
            this._ws.emit("status", config);
        });
    }
}