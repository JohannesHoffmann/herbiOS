import NamespaceSocket from "../api/websocket/NamespaceSocket";
import { Socket, Server} from "socket.io";
import { IPowerConfig } from "./PowerConfig";
import PowerService from "./PowerService";

 type  PowerEventsListen = {
     ["status"]: () => void,
     ["switch:set"]: (set: {name: keyof  IPowerConfig["switches"], on: boolean}) => void,
    }
    
    type  PowerEventsEmit = {
     ["status"]: (status: IPowerConfig) => void,
 }

/**
 * Class to send herp system events over the socket server under the /events namespace
 *
 * @export
 * @class LightsSocket
 * @extends {NamespaceSocket}
 */
export default class PowerSocket extends NamespaceSocket {

    constructor(ws: Server<PowerEventsListen, PowerEventsEmit>) {
        super(ws, "/power");
    }

    protected _socket(socket: Socket<PowerEventsListen, PowerEventsEmit>) {
        socket.emit("status", PowerService.getInstance().getConfig());

        socket.on("status", () => {
            socket.emit("status", PowerService.getInstance().getConfig());
        });

        socket.on("switch:set", (message) => {
            if ( PowerService.getInstance().getConfig().switches.hasOwnProperty(message.name)) {
                PowerService.getInstance().setSwitch(message.name, message.on);
            } 
            
        });
    }

    public updateStatus(status: IPowerConfig) {
        this._ws.emit("status", status);
    }
}