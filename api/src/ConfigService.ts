import * as Path from 'path';
import * as Fs from 'fs';
import { ILightConfiguration } from './lights/ILights';
import { ISwitchConfiguration } from './switches/ISwitches';
import { IFanConfiguration } from './fans/IFans';
import { ISensorConfiguration } from './sensors/ISensors';


export interface IConfig {
    env: string,
    airPlay: string;
    database: string;
    configurationDirectory: string;
    mqtt: {
        host: string;
        port?: number;
        username?: string;
        password?: string;
    }
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
    },
    openWeatherApiKey: string;
    lights?: Array<ILightConfiguration>;
    switches?: Array<ISwitchConfiguration>;
    fans?: Array<IFanConfiguration>;
    sensors?: Array<ISensorConfiguration>;
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
        configurationDirectory: "data/",
        airPlay: "/tmp/shairport-sync-metadata",
        database: "sqlite:./data/db.sqlite",
        serial: {
            path: "/dev/ttyACM0",
            baud: 115200,
        },
        mqtt: {
            host: "localhost",
            port: 1883
        },
        rest: {
            port: 5555,
        },
        webSocket: {
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
        authentication: {
            secret: "defaultSalt",
            expiration: "30d",
        },
        openWeatherApiKey: "Get your key on https://openweathermap.org/appid"
    };

    private constructor() {
        const configPath = Path.join(__dirname, `../`, this.config.configurationDirectory+ "config.json");
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