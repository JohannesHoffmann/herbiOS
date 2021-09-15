import NamespaceSocket from "../api/websocket/NamespaceSocket";
import { Socket, Server} from "socket.io";
import { IPoi } from "./PoiModel";
import PoiService from "./PoiService";

 type  PoiEventsListen = {
     ["activePoi"]: () => void,
    }
    
    type  PoiEventsEmit = {
     ["activePoi"]: (activePoi: IPoi | undefined) => void,
 }

/**
 * Class to send herp system events over the socket server under the /events namespace
 *
 * @export
 * @class LightsSocket
 * @extends {NamespaceSocket}
 */
export default class PoiSocket extends NamespaceSocket {

    constructor(ws: Server<PoiEventsListen, PoiEventsEmit>) {
        super(ws, "/pois");
    }

    protected _socket(socket: Socket<PoiEventsListen, PoiEventsEmit>) {
        // socket.emit("activePoi", PoiService.getInstance().getActivePoi());

        // // Request active tour
        // socket.on("activePoi", () => {
        //     socket.emit("activePoi", PoiService.getInstance().getActivePoi());
        // });
    }

    public updateActivePoi(tour: IPoi) {
        this._ws.emit("activePoi", tour);
    }
}