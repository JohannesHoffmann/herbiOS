import * as Path from 'path';
import * as Fs from 'fs';


export interface IConfig {
    env: string,
    homeAssistantIntegration: boolean;
    serial: {
        path: string;
        baud: number;
    },
    lights: Array<{
        name: string;
        setTopics?: Array<string>;
        stateTopics?: Array<string>;
        brightness: boolean;
        sensorerId: string;
    }>;
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
       homeAssistantIntegration: true,
       serial: {
            path: "/dev/ttyACM0",
            baud: 115200,
        },
       lights: [{
           name: "Main Light",
           brightness: true,
           sensorerId: "light1",
       }],
    };

    private constructor() {
        const configPath = Path.join(__dirname, `..`, "config.json");
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