import NamespaceSocket from "../NamespaceSocket";
import { Server} from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export default class DefaultNamespace extends NamespaceSocket {

    constructor(ws: Server<DefaultEventsMap, DefaultEventsMap>) {
        super(ws, "/");
    }

    protected _socket(socket) {

        // Message event
        socket.on("me", (message) => {
            socket.emit("me", socket.User);
        });
    }
}