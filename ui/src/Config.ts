export interface IConfig {
    host: string;
    tileServer: string;
    groundControl: string;
}

const Config: IConfig = {
    // host: "http://localhost:5555",
    // tileServer:"http://localhost:5080",
    // host: "http://192.168.180.25:5555",
    // tileServer:"http://192.168.180.25:5080",
    // host: "http://192.168.2.72:5555",
    // tileServer:"http://192.168.2.72:5080",
    host: "http://192.168.4.1:5555",
    tileServer:"http://192.168.4.1:8088",
    groundControl: "https://groundcontrol.juhujuhu.de",
}

export default Config;