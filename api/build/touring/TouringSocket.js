"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NamespaceSocket_1 = __importDefault(require("../api/websocket/NamespaceSocket"));
const TouringService_1 = __importDefault(require("./TouringService"));
/**
 * Class to send herp system events over the socket server under the /events namespace
 *
 * @export
 * @class LightsSocket
 * @extends {NamespaceSocket}
 */
class TouringSocket extends NamespaceSocket_1.default {
    constructor(ws) {
        super(ws, "/touring");
    }
    _socket(socket) {
        socket.emit("activeTour", TouringService_1.default.getInstance().getActiveTour());
        // Request active tour
        socket.on("activeTour", () => {
            socket.emit("activeTour", TouringService_1.default.getInstance().getActiveTour());
        });
    }
    updateActiveTour(tour) {
        this._ws.emit("activeTour", tour);
    }
}
exports.default = TouringSocket;
//# sourceMappingURL=TouringSocket.js.map