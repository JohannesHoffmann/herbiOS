export interface IConfig {
    host: string;
    tileServer: string;
    groundControl: string;
}

console.log( );

const Config: IConfig = {
    host: window.location.hostname === "localhost" ? "http://localhost:5555"  : "http://192.168.4.1:5555",
    tileServer: window.location.hostname === "localhost" ? "http://localhost:8088"  : "http://192.168.4.1:8088",
    groundControl: "https://groundcontrol.juhujuhu.de",
}

export default Config;