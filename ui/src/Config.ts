export interface IConfig {
    host: string;
    socket: string;
    tileServer: string;
    groundControl: string;
}

const host = "192.168.4.1";

const Config: IConfig = {
    host: window.location.hostname === "localhost" ? "/api"  : `https://${host}/api`,
    socket: window.location.hostname === "localhost" ? "wss://localhost:8443"  : `wss://${host}:8443`,
    tileServer: window.location.hostname === "localhost" ? "https://localhost:8444"  : `https://${host}:8444`,
    groundControl: "https://groundcontrol.tld",
}

export default Config;