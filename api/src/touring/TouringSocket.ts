import NamespaceSocket from "../api/websocket/NamespaceSocket";
import { Socket, Server} from "socket.io";
import { ITour } from "./TourModel";
import TouringService from "./TouringService";

 type  TouringEventsListen = {
     ["activeTour"]: () => void,
    }
    
    type  TouringEventsEmit = {
     ["activeTour"]: (activeTour: ITour | undefined) => void,
 }

/**
 * Class to send herp system events over the socket server under the /events namespace
 *
 * @export
 * @class LightsSocket
 * @extends {NamespaceSocket}
 */
export default class TouringSocket extends NamespaceSocket {

    constructor(ws: Server<TouringEventsListen, TouringEventsEmit>) {
        super(ws, "/touring");
    }

    protected _socket(socket: Socket<TouringEventsListen, TouringEventsEmit>) {
        socket.emit("activeTour", TouringService.getInstance().getActiveTour());

        // Request active tour
        socket.on("activeTour", () => {
            socket.emit("activeTour", TouringService.getInstance().getActiveTour());
        });
    }

    public updateActiveTour(tour: ITour) {
        this._ws.emit("activeTour", tour);
    }
}