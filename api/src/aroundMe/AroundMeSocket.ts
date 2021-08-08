import NamespaceSocket from "../api/websocket/NamespaceSocket";
import { Socket, Server} from "socket.io";
import { IAroundMeConfig } from "./AroundMeConfig";
import AroundMeService from "./AroundMeService";

 type  AroundMeEventsListen = {
     ["status"]: () => void,
    }
    
    type  AroundMeEventsEmit = {
     ["status"]: (status: IAroundMeConfig) => void,
 }

/**
 * Class to send herp system events over the socket server under the /events namespace
 *
 * @export
 * @class LightsSocket
 * @extends {NamespaceSocket}
 */
export default class AroundMeSocket extends NamespaceSocket {

    constructor(ws: Server<AroundMeEventsListen, AroundMeEventsEmit>) {
        super(ws, "/aroundMe");
    }

    protected _socket(socket: Socket<AroundMeEventsListen, AroundMeEventsEmit>) {
        socket.emit("status", AroundMeService.getInstance().getConfig());

        // Request lights
        socket.on("status", () => {
            socket.emit("status", AroundMeService.getInstance().getConfig());
        });
    }

    public updateStatus(status: IAroundMeConfig) {
        this._ws.emit("status", status);
    }
}