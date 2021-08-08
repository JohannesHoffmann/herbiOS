import WebSocket from 'ws';
import ConfigService from './ConfigService';
import RestService from './RestService';

declare module "ws" {
    class _WS extends WebSocket { }
    export interface WebSocket extends _WS {
        user?: {name: string, type: string, iat: number, exp: number,};
    }
  }

interface WsMessage {
    type: string;
    payload: any;
}

type MessageCallback = (payload: any) => void

class WebSocketService {

    private static instance: WebSocketService;

    public static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    private server: WebSocket.Server;
    private clientsAuthenticated: Array<WebSocket> = [];

    private messageListener: {[key: string]: Array<MessageCallback>} = {
        getControl: [
            
        ]
    };

    private constructor() {
        this.server = new WebSocket.Server({
            port: ConfigService.getInstance().config.webSocket.port,
            perMessageDeflate: {
              zlibDeflateOptions: {
                // See zlib defaults.
                chunkSize: 1024,
                memLevel: 7,
                level: 3
              },
              zlibInflateOptions: {
                chunkSize: 10 * 1024
              },
              // Other options settable:
              clientNoContextTakeover: true, // Defaults to negotiated value.
              serverNoContextTakeover: true, // Defaults to negotiated value.
              serverMaxWindowBits: 10, // Defaults to negotiated value.
              // Below options specified as default values.
              concurrencyLimit: 10, // Limits zlib concurrency for perf.
              threshold: 1024 // Size (in bytes) below which messages
              // should not be compressed.
            },
          });

          this.listenOnConnections();
    }

    public onMessage(message: string, callback: MessageCallback) {
        if (!this.messageListener.hasOwnProperty(message)) {
            this.messageListener[message] = [];
        }

        this.messageListener[message].push(callback);
    }

    private listenOnConnections() {
        this.server.on('connection', (ws) => {

            // send initial configuration:

            ws.on('message', (msg) => {

                const message: WsMessage = JSON.parse(msg.toString());

                if (message.type === "authenticate") {
                    const token = message.payload.token;
                    if (!token) {
                        ws.user = undefined;
                    } else {
                        try {
                            ws.user =  RestService.getInstance().server.jwt.verify(token);
    
                            
                        } catch (e) {
                            if (e.message === "jwt expired") {
                                ws.send(JSON.stringify({
                                    type: "authenticateExpired",
                                }));
                                return;
                            } else {
                                
                            }
                        }
                    }
                }

                if (!ws.user) {
                    ws.send(JSON.stringify({
                        type: "authenticate",
                    }));
                    return;
                }

                if (this.messageListener.hasOwnProperty(message.type)) {
                    this.messageListener[message.type].forEach(fn => fn(message.payload));
                }

                switch(message.type) {
                  

                }
            });
        

        });
    }


    public sendToAll(message: WsMessage) {
        this.server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN && client.user) {
                // User Token is expired so call to authenticate
                if (Date.now() >= client.user.exp * 1000) {
                    client.send(JSON.stringify({
                        type: "authenticate",
                    }));
                    return;
                }
                client.send(JSON.stringify(message));
            }
        });
    }


}

export default WebSocketService;