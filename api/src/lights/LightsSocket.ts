import NamespaceSocket from "../api/websocket/NamespaceSocket";
import { Socket, Server} from "socket.io";
import LightsService from "./LightsService";
import Light from "./Light";

 type  LightsEventsListen = {
     ["light:change"]: (message: {lightId: number; value: number}) => void,
     ["light"]: (message: {lightId: number}) => Light,
     ["lights"]: () => void,
    }
    
    type  LightsEventsEmit = {
     ["lights"]: (lights: Array<Light>) => void,
     ["light"]: (lights: Array<Light>) => void,
 }

/**
 * Class to send herp system events over the socket server under the /events namespace
 *
 * @export
 * @class LightsSocket
 * @extends {NamespaceSocket}
 */
export default class LightsSocket extends NamespaceSocket {

    constructor(ws: Server<LightsEventsListen, LightsEventsEmit>) {
        super(ws, "/lights");
    }

    protected _socket(socket: Socket<LightsEventsListen, LightsEventsEmit>) {
        socket.emit("lights", LightsService.getInstance().lights);

        // Request lights
        socket.on("lights", () => {
            socket.emit("lights", LightsService.getInstance().lights);
        });

        // Request lights
        socket.on("light:change", (message) => {
            LightsService.getInstance().setLightLevel(message.lightId, message.value);
            this._ws.emit("lights", LightsService.getInstance().lights);
        });
    }

    /**
     * send an Event with a given payload
     *
     * @param {LightsMessages} event
     * @memberof LightsSocket
     */
    public sendEvent(event: any) {
        const payload = event["payload"] ? event["payload"] : Math.random();
        this._ws.emit(event.eventName, payload);
    }
}