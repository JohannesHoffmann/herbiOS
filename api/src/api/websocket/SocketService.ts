import { Server } from "socket.io";
import * as http from 'http';
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import DefaultNamespace from "./namespaces/DefaultNamespace";
import AudioSocket from "../../audio/AudioSocket";
import GeoSocket from "../../geo/GeoSocket";
import NetworkingSocket from "../../networking/NetworkingSocket";
import AroundMeSocket from "../../aroundMe/AroundMeSocket";
import TouringSocket from "../../touring/TouringSocket";
import PoiSocket from "../../poi/PoiSocket";
import MqttSocket from "../mqtt/MqttSocket";

export interface IUser  {name: string, type: string, iat: number, exp: number,};


declare module 'socket.io' {
    interface Socket {
      user: IUser;
    }
}

interface INamespaces {
    default: DefaultNamespace;
    audio: AudioSocket;
    geo: GeoSocket;
    networking: NetworkingSocket;
    aroundMe: AroundMeSocket;
    touring: TouringSocket;
    pois: PoiSocket;
    mqtt: MqttSocket;
}

/**
 * Service to manage socket server and namespaces
 *
 * @class SocketService
 */
class SocketService {
    private static instance: SocketService;

    private _io: Server<DefaultEventsMap, DefaultEventsMap>; // Socket.io server instance

    private _namespaces: INamespaces;

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }

        return SocketService.instance;
    }

    private constructor () {}

    /**
     * initiate the server and namespaces
     *
     * @param {http.Server} server
     * @memberof SocketService
     */
    public async init (server: http.Server ) {
        this._io = new Server(server, {
            cors: {
                origin: "*",
            }
        });

        this._namespaces = {
            default: new DefaultNamespace(this._io),
            audio: new AudioSocket(this._io),
            geo: new GeoSocket(this._io),
            networking: new NetworkingSocket(this._io),
            aroundMe: new AroundMeSocket(this._io),
            touring: new TouringSocket(this._io),
            pois: new PoiSocket(this._io),
            mqtt: new MqttSocket(this._io),
        };
    }

    /**
     * get the instance of a particular namespace
     *
     * @template K
     * @param {K} name
     * @return {*}  {INamespaces[K]}
     * @memberof SocketService
     */
    public getNamespace<K extends keyof INamespaces>(name: K): INamespaces[K] {
        return this._namespaces[name];
    }
}

export default SocketService;