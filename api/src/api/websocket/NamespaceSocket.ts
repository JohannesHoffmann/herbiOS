import { Socket, Server, Namespace } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import * as  jwt from "jsonwebtoken";
import ConfigService from "../../ConfigService";
import { IUser } from "./SocketService";


/**
 * Abstract class for each namespace. Handles authentication for each namespace.
 *
 * @export
 * @abstract
 * @class NamespaceSocket
 */
export default abstract class NamespaceSocket {

    protected _ws: Namespace<DefaultEventsMap, DefaultEventsMap>;
    private _namespace: string;

    constructor(ws: Server<DefaultEventsMap, DefaultEventsMap>, namespace: string) {
        this._namespace = namespace;
        this._ws = ws.of(namespace);

        // Authentication middleware on connection setup
        this._ws.use((socket, next) => {
            try {
                const token = socket.handshake.auth.token.replace("Bearer ", "");
                jwt.verify(token, ConfigService.getInstance().config.authentication.secret);
                socket.user = jwt.decode(token) as IUser;
                next();
            } catch (e) {
                const err = new Error("not authenticated");
                next(err);
            }            
        });

        this._ws.on("connection", (socket) => {
            // Authentication middleware on every request
            socket.use((event, next) => {
                try {
                    const token = socket.handshake.auth.token.replace("Bearer ", "");
                    jwt.verify(token, ConfigService.getInstance().config.authentication.secret);
                    next();
                } catch (e) {
                    const err = new Error("not authenticated");
                    next(err);
                }
            });

            // Error catcher
            socket.on("error", (err) => {
                if (err && err.message === "not authenticated") {
                    socket.emit("unauthenticated");
                    socket.disconnect();
                }
            });

            // Apply all listener
            this._socket(socket);
        });
    }

    /**
     * Get the namespace socket instance.
     *
     * @readonly
     * @memberof NamespaceSocket
     */
    public get namespace() {
        return this._namespace;
    }


    /**
     * overwritable method to apply listeners/logic on each connected socket.
     *
     * @protectede
     * @param {Socket} socket
     * @memberof NamespaceSocket
     */
    protected _socket(socket: Socket) {

    }
}