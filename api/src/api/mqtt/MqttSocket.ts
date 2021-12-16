import NamespaceSocket from "../websocket/NamespaceSocket";
import { Socket, Server} from "socket.io";
import MqttService from "./MqttService";

 type  EventsListen = {
    ["subscribe"]: (message: {topic: string | Array<string>}) => void,
    ["publish"]: (message: {topic: string, message: string}) => void,
}
    
type  EventsEmit = {
    ["message"]: (topic: string, message: string) => void,
}

/**
 * Class to proxy mqtt subscriptions and messages via socket to the frontend
 *
 * @export
 * @class MqttSocket
 * @extends {NamespaceSocket}
 */
export default class MqttSocket extends NamespaceSocket {

    constructor(ws: Server<EventsListen, EventsEmit>) {
        super(ws, "/mqtt");

        MqttService.getInstance().onMessage((topic, message) => {
            this._ws.emit("message", {topic, message: message.toString()});
        });
    }

    protected _socket(socket: Socket<EventsListen, EventsEmit>) {

        socket.on("subscribe", ({topic}) => {
            // unsubscribe first then resubscribe. This is necessary to broadcast all retain messages again to new subscribers.
            MqttService.getInstance().unsubscribe(topic);
            MqttService.getInstance().subscribe(topic);
        });

        socket.on("publish", ({topic, message}) => {
            MqttService.getInstance().publish(topic, message);
        });

    }
}