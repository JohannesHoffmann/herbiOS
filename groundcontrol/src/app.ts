import RestService from "./RestService";
import WebSocketService from "./WebSocketService";


const start = async () => {
    RestService.getInstance().start();
    WebSocketService.getInstance();
}

start();