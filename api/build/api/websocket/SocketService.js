"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const DefaultNamespace_1 = __importDefault(require("./namespaces/DefaultNamespace"));
const AudioSocket_1 = __importDefault(require("../../audio/AudioSocket"));
const AroundMeSocket_1 = __importDefault(require("../../aroundMe/AroundMeSocket"));
const TouringSocket_1 = __importDefault(require("../../touring/TouringSocket"));
const PoiSocket_1 = __importDefault(require("../../poi/PoiSocket"));
const MqttSocket_1 = __importDefault(require("../mqtt/MqttSocket"));
;
/**
 * Service to manage socket server and namespaces
 *
 * @class SocketService
 */
class SocketService {
    constructor() { }
    static getInstance() {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }
    /**
     * initiate the server and namespaces
     *
     * @param {http.Server} server
     * @memberof SocketService
     */
    init(server) {
        return __awaiter(this, void 0, void 0, function* () {
            this._io = new socket_io_1.Server(server, {
                cors: {
                    origin: "*",
                }
            });
            this._namespaces = {
                default: new DefaultNamespace_1.default(this._io),
                audio: new AudioSocket_1.default(this._io),
                aroundMe: new AroundMeSocket_1.default(this._io),
                touring: new TouringSocket_1.default(this._io),
                pois: new PoiSocket_1.default(this._io),
                mqtt: new MqttSocket_1.default(this._io),
            };
        });
    }
    /**
     * get the instance of a particular namespace
     *
     * @template K
     * @param {K} name
     * @return {*}  {INamespaces[K]}
     * @memberof SocketService
     */
    getNamespace(name) {
        return this._namespaces[name];
    }
}
exports.default = SocketService;
//# sourceMappingURL=SocketService.js.map