import { Server } from "socket.io";
import * as http from 'http';
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import DefaultNamespace from "./namespaces/DefaultNamespace";
import LightsSocket from "../../lights/LightsSocket";
import ClimateSocket from "../../climate/ClimateSocket";
import AudioSocket from "../../audio/AudioSocket";
import GeoSocket from "../../geo/GeoSocket";
import NetworkingSocket from "../../networking/NetworkingSocket";
import PowerSocket from "../../power/PowerSocket";
import AroundMeSocket from "../../aroundMe/AroundMeSocket";
import SwitchesSocket from "../../switches/SwitchesSocket";
import TouringSocket from "../../touring/TouringSocket";

export interface IUser  {name: string, type: string, iat: number, exp: number,};


declare module 'socket.io' {
    interface Socket {
      user: IUser;
    }
}

interface INamespaces {
    default: DefaultNamespace;
    lights: LightsSocket;
    climate: ClimateSocket;
    audio: AudioSocket;
    geo: GeoSocket;
    networking: NetworkingSocket;
    power: PowerSocket;
    aroundMe: AroundMeSocket;
    switches: SwitchesSocket;
    touring: TouringSocket;
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
            lights: new LightsSocket(this._io),
            climate: new ClimateSocket(this._io),
            audio: new AudioSocket(this._io),
            geo: new GeoSocket(this._io),
            networking: new NetworkingSocket(this._io),
            power: new PowerSocket(this._io),
            aroundMe: new AroundMeSocket(this._io),
            switches: new SwitchesSocket(this._io),
            touring: new TouringSocket(this._io),
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