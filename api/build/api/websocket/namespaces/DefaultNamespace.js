"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NamespaceSocket_1 = __importDefault(require("../NamespaceSocket"));
class DefaultNamespace extends NamespaceSocket_1.default {
    constructor(ws) {
        super(ws, "/");
    }
    _socket(socket) {
        // Message event
        socket.on("me", (message) => {
            socket.emit("me", socket.User);
        });
    }
}
exports.default = DefaultNamespace;
//# sourceMappingURL=DefaultNamespace.js.map