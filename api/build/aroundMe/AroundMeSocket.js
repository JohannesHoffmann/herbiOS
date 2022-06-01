"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NamespaceSocket_1 = __importDefault(require("../api/websocket/NamespaceSocket"));
const AroundMeService_1 = __importDefault(require("./AroundMeService"));
/**
 * Class to send herp system events over the socket server under the /events namespace
 *
 * @export
 * @class LightsSocket
 * @extends {NamespaceSocket}
 */
class AroundMeSocket extends NamespaceSocket_1.default {
    constructor(ws) {
        super(ws, "/aroundMe");
    }
    _socket(socket) {
        socket.emit("status", AroundMeService_1.default.getInstance().getConfig());
        // Request lights
        socket.on("status", () => {
            socket.emit("status", AroundMeService_1.default.getInstance().getConfig());
        });
    }
    updateStatus(status) {
        this._ws.emit("status", status);
    }
}
exports.default = AroundMeSocket;
//# sourceMappingURL=AroundMeSocket.js.map