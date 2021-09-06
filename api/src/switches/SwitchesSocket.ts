import NamespaceSocket from "../api/websocket/NamespaceSocket";
import { Socket, Server} from "socket.io";
import SwitchesService from "./SwitchesService";
import Switch from "./Switch";

 type  SwitchesEventsListen = {
     ["switch:on"]: (message: {switchId: number;}) => void,
     ["switch:off"]: (message: {switchId: number;}) => void,
     ["switches"]: () => void,
    }
    
    type  SwitchesEventsEmit = {
     ["switches"]: (switches: Array<Switch>) => void,
 }

/**
 * Class to send herp system events over the socket server under the /events namespace
 *
 * @export
 * @class SwitchesSocket
 * @extends {NamespaceSocket}
 */
export default class SwitchesSocket extends NamespaceSocket {

    constructor(ws: Server<SwitchesEventsListen, SwitchesEventsEmit>) {
        super(ws, "/switches");
    }

    protected _socket(socket: Socket<SwitchesEventsListen, SwitchesEventsEmit>) {
        socket.emit("switches", SwitchesService.getInstance().switches);

        // Request switches
        socket.on("switches", () => {
            socket.emit("switches", SwitchesService.getInstance().switches);
        });

        // Request switches
        socket.on("switch:on", (message) => {
            SwitchesService.getInstance().setSwitchOn(message.switchId);
            this._ws.emit("switches", SwitchesService.getInstance().switches);
        });
        socket.on("switch:off", (message) => {
            SwitchesService.getInstance().setSwitchOff(message.switchId);
            this._ws.emit("switches", SwitchesService.getInstance().switches);
        });
    }

    /**
     * send an Event with a given payload
     *
     * @param {SwitchesMessages} event
     * @memberof SwitchesSocket
     */
    public sendEvent(event: any) {
        const payload = event["payload"] ? event["payload"] : Math.random();
        this._ws.emit(event.eventName, payload);
    }
}