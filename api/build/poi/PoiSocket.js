"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NamespaceSocket_1 = __importDefault(require("../api/websocket/NamespaceSocket"));
/**
 * Class to send herp system events over the socket server under the /events namespace
 *
 * @export
 * @class LightsSocket
 * @extends {NamespaceSocket}
 */
class PoiSocket extends NamespaceSocket_1.default {
    constructor(ws) {
        super(ws, "/pois");
    }
    _socket(socket) {
        // socket.emit("activePoi", PoiService.getInstance().getActivePoi());
        // // Request active tour
        // socket.on("activePoi", () => {
        //     socket.emit("activePoi", PoiService.getInstance().getActivePoi());
        // });
    }
    updateActivePoi(tour) {
        this._ws.emit("activePoi", tour);
    }
}
exports.default = PoiSocket;
//# sourceMappingURL=PoiSocket.js.map