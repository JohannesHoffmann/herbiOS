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
    sensors: Array<{
        name: string;
        sensorerId: string;
        unit_of_measurement?: string;
        icon?: "thermometer" | "battery";
        stateTopics?: Array<string>;
    }>;
    switches: Array<{
        name: string;
        setTopics?: Array<string>;
        stateTopics?: Array<string>;
        sensorerId: number;
        reverse?: boolean;
    }>;
    fans: Array<{
        name: string;
        sensorerId: string;
        setTopics?: Array<string>;
        stateTopics?: Array<string>;

        preset_modes?: Array<string>;
        preset_mode_command_topic?: Array<string>;
        preset_mode_state_topic?: Array<string>;

        speed?: boolean;
        speed_state_topic?: Array<string>;
        speed_command_topic?: Array<string>;
    }>;
    climates: Array<{
        name: string;
        sensorerId: string;

        modes?: Array<string>;
        mode_command_topic?: Array<string>;
        mode_state_topic?: Array<string>;

        preset_modes?: Array<string>;
        preset_mode_command_topic?: Array<string>;
        preset_mode_state_topic?: Array<string>;

        fan_modes?: boolean;
        fan_mode_state_topic?: Array<string>;
        fan_mode_command_topic?: Array<string>;

        temperature_initial?: number;
        temperature_command_topic?: Array<string>;
        temperature_state_topic?: Array<string>;
        temperature_current_topic?: Array<string>;
        
        availability_topic?: Array<string>;
    }>;
    networking: {
        interfaces: Array<{
            name: string;
            interfaceName: string;

            setTopics?: Array<string>;
            stateTopics?: Array<string>;

            signal_strength_state_topic?: Array<string>;
        }>;
        modems: Array<{
            name: string;
            interfaceName: string;
            ip: string;
            setTopics?: Array<string>;
            stateTopics?: Array<string>;

            signal_strength_state_topic?: Array<string>;
            network_type_state_topic?: Array<string>;
        }>;
    };
    geoPosition: {
        state_topics?: Array<string>;
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
       homeAssistantIntegration: true,
       serial: {
            path: "/dev/ttyACM0",
            baud: 115200,
        },
       lights: [
           {
            name: "Main Light",
            brightness: true,
            sensorerId: "light1",
        }
        ],
       switches: [
            {
                name: "Power Switch",
                sensorerId: 1,
            }
       ],
       fans: [
            {
                name: "Cabin Fan",
                sensorerId: "overhead",
            }
       ], 
       climates: [
           {
               name: "Heater",
               sensorerId: "heater",
           }
       ],
       geoPosition: {
           state_topics: [],
       },
       sensors: [
           {
               name: "Room temperature",
               sensorerId: "temperature1",
               icon: "thermometer"
           }
       ],
       networking: {
           modems: [],
           interfaces: [],
       },
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