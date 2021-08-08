import NamespaceSocket from "../api/websocket/NamespaceSocket";
import { Socket, Server} from "socket.io";
import { INetworkingConfig } from "./NetworkingConfig";
import NetworkingService from "./NetworkingService";

 type  NetworkingEventsListen = {
     ["status"]: () => void,
     ["wifi:change"]: (set: {on: boolean}) => void,
     ["cellular:change"]: (set: {on: boolean}) => void,
    }
    
    type  NetworkingEventsEmit = {
     ["status"]: (status: INetworkingConfig) => void,
 }

/**
 * Class to send herp system events over the socket server under the /events namespace
 *
 * @export
 * @class LightsSocket
 * @extends {NamespaceSocket}
 */
export default class NetworkingSocket extends NamespaceSocket {

    constructor(ws: Server<NetworkingEventsListen, NetworkingEventsEmit>) {
        super(ws, "/networking");
    }

    protected _socket(socket: Socket<NetworkingEventsListen, NetworkingEventsEmit>) {
        socket.emit("status", NetworkingService.getInstance().getConfig());

        socket.on("status", () => {
            socket.emit("status", NetworkingService.getInstance().getConfig());
        });

        socket.on("wifi:change", (message) => {
            NetworkingService.getInstance().wifiOn(message.on);
        });

        socket.on("cellular:change", (message) => {
            console.log("Recieved cellular message", message);
            if (message.on) {
                NetworkingService.getInstance().cellularConnect();
            } else {
                NetworkingService.getInstance().cellularDisconnect();
            }
        });
    }

    public updateStatus(status: INetworkingConfig) {
        this._ws.emit("status", status);
    }
}