import * as Path from 'path';
import * as Fs from 'fs';


export interface IConfig {
    env: string,
    dataStorage: {
        vitals: string,
        geo: string,
        controls: string;
        config: string;
    },
    airPlay: string;
    database: string;
    serial: {
        path: string;
        baud: number;
    },
    rest: {
        port: number;
    },
    groundControl: {
        url: string;
    },
    modes: Array<{
            name: string;
            cron: string;
        }
    >,
    webSocket: {
        port: number,
    },
    authentication: {
        secret: string;
        expiration: string;
    }
}

class ConfigService {

    private static instance: ConfigService;

    public static getInstance(): ConfigService {
        if (!ConfigService.instance) {
            ConfigService.instance = new ConfigService();
        }
        return ConfigService.instance;
    }

    config: IConfig = {
        env: "development",
        dataStorage: {
            vitals: "data/vitals.json",
            geo: "data/gps.json",
            controls: "data/controls.json",
            config: "data/config.json",
        },
        airPlay: "/tmp/shairport-sync-metadata",
        database: "sqlite:./data/db.sqlite",
        serial: {
            path: "/dev/ttyACM0",
            baud: 500000,
        },
        rest: {
            port: 5555,
        },
        groundControl: {
            url: "https://groundcontrol.tld",
        },
        modes: [
            {
                name: "tour",
                cron: "0 */5 * * * *",
            },
            {
                name: "parking",
                cron: "0 */30 * * * *",
            },
            {
                name: "long-parking",
                cron: "0 * */6 * * *",
            },
        ],
        webSocket: {
            port: 5555,
        },
        authentication: {
            secret: "defaultSalt",
            expiration: "30d",
        }
    };

    private constructor() {
        const configPath = Path.join(__dirname, `../`, this.config.dataStorage.config);
        if (Fs.existsSync(configPath)) {
            const loadedConfig = Fs.readFileSync(configPath, {encoding: "utf-8"});
            this.config = {...{}, ...this.config, ...JSON.parse(loadedConfig)};
        } else {
            Fs.writeFileSync(configPath, JSON.stringify(this.config, null, 4));
        }
    }

    getConfig(): IConfig {
        return this.config;
    }

}

export default ConfigService;