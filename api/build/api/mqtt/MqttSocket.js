"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NamespaceSocket_1 = __importDefault(require("../websocket/NamespaceSocket"));
const MqttService_1 = __importDefault(require("./MqttService"));
/**
 * Class to proxy mqtt subscriptions and messages via socket to the frontend
 *
 * @export
 * @class MqttSocket
 * @extends {NamespaceSocket}
 */
class MqttSocket extends NamespaceSocket_1.default {
    constructor(ws) {
        super(ws, "/mqtt");
        MqttService_1.default.getInstance().onMessage((topic, message) => {
            this._ws.emit("message", { topic, message: message.toString() });
        });
    }
    _socket(socket) {
        socket.on("subscribe", ({ topic }) => {
            // unsubscribe first then resubscribe. This is necessary to broadcast all retain messages again to new subscribers.
            MqttService_1.default.getInstance().unsubscribe(topic);
            MqttService_1.default.getInstance().subscribe(topic);
        });
        socket.on("publish", ({ topic, message }) => {
            MqttService_1.default.getInstance().publish(topic, message);
        });
    }
}
exports.default = MqttSocket;
//# sourceMappingURL=MqttSocket.js.map