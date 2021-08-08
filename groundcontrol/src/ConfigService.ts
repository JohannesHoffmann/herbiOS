import * as Path from 'path';
import * as Fs from 'fs';


export interface IConfig {
    env: string,
    dataStorage: {
        telemetry: string;
        config: string;
    },
    database: string;
    rest: {
        port: number;
    },
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
            telemetry: "data/telemetry.json",
            config: "data/config.json",
        },
        database: "mongodb://localhost:27017/herbi-van",
        rest: {
            port: 6000,
        },
        webSocket: {
            port: 6666,
        },
        authentication: {
            secret: "defaultSalt",
            expiration: "30d",
        }
    };

    private constructor() {
        const configPath = Path.join(__dirname, `../`, this.config.dataStorage.config);
        if (Fs.existsSync(configPath)) {
            console.log("Read Config file from", configPath);
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