"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("jsonwebtoken"));
const ConfigService_1 = __importDefault(require("../../ConfigService"));
/**
 * Abstract class for each namespace. Handles authentication for each namespace.
 *
 * @export
 * @abstract
 * @class NamespaceSocket
 */
class NamespaceSocket {
    constructor(ws, namespace) {
        this._namespace = namespace;
        this._ws = ws.of(namespace);
        // Authentication middleware on connection setup
        this._ws.use((socket, next) => {
            try {
                const token = socket.handshake.auth.token.replace("Bearer ", "");
                jwt.verify(token, ConfigService_1.default.getInstance().config.authentication.secret);
                socket.user = jwt.decode(token);
                next();
            }
            catch (e) {
                const err = new Error("not authenticated");
                next(err);
            }
        });
        this._ws.on("connection", (socket) => {
            // Authentication middleware on every request
            socket.use((event, next) => {
                try {
                    const token = socket.handshake.auth.token.replace("Bearer ", "");
                    jwt.verify(token, ConfigService_1.default.getInstance().config.authentication.secret);
                    next();
                }
                catch (e) {
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
    get namespace() {
        return this._namespace;
    }
    /**
     * overwritable method to apply listeners/logic on each connected socket.
     *
     * @protectede
     * @param {Socket} socket
     * @memberof NamespaceSocket
     */
    _socket(socket) {
    }
}
exports.default = NamespaceSocket;
//# sourceMappingURL=NamespaceSocket.js.map