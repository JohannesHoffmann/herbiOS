import { SubTopic, Topic } from "../api/mqtt/IMqtt";
import MqttService from "../api/mqtt/MqttService";
import ConfigService from "../ConfigService";

class SensorsService {

    private static instance: SensorsService;
    private _config = ConfigService.getInstance().getConfig();

    public static getInstance(): SensorsService {
        if (!SensorsService.instance) {
         SensorsService.instance = new SensorsService();
        }
        return SensorsService.instance;
    }

    private constructor() {
        this.init();
    }

    public async init() {

        // Register manual configured switches to mqtt auto discovery
        if (this._config.sensors) {
            const sensorsToRegister = this._config.sensors;
            for (const sensor of sensorsToRegister) {
                MqttService.getInstance().publish(
                    `${Topic.namespace}/${SubTopic.sensor}/${sensor.unique_id}/${Topic.config}`,
                    JSON.stringify(sensor),
                )
            }
        }
    }
}

export default SensorsService;