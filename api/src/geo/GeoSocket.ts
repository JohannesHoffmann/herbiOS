import NamespaceSocket from "../api/websocket/NamespaceSocket";
import { Socket, Server} from "socket.io";
import { IGeo, IGeoConfig } from "./GeoConfig";
import GeoService from "./GeoService";

 type  GeoEventsListen = {
     ["status"]: () => void,
    }
    
    type  GeoEventsEmit = {
     ["status"]: (status: IGeoConfig) => void,
 }

/**
 * Class to send herp system events over the socket server under the /events namespace
 *
 * @export
 * @class LightsSocket
 * @extends {NamespaceSocket}
 */
export default class GeoSocket extends NamespaceSocket {

    constructor(ws: Server<GeoEventsListen, GeoEventsEmit>) {
        super(ws, "/geo");
    }

    protected _socket(socket: Socket<GeoEventsListen, GeoEventsEmit>) {
        socket.emit("status", GeoService.getInstance().getConfig());

        // Request lights
        socket.on("status", () => {
            socket.emit("status", GeoService.getInstance().getConfig());
        });
    }

    public updateStatus(status: IGeoConfig) {
        this._ws.emit("status", status);
    }
}