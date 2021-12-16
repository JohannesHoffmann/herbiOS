import { SubTopic, Topic } from "../api/mqtt/IMqtt";
import MqttService from "../api/mqtt/MqttService";
import ConfigService from "../ConfigService";

class LightsService {

    private static instance: LightsService;
    private _config = ConfigService.getInstance().getConfig();

    public static getInstance(): LightsService {
        if (!LightsService.instance) {
         LightsService.instance = new LightsService();
        }
        return LightsService.instance;
    }

    private constructor() {
        this.init();
    }

    public async init() {

        // Register manual configured lights to mqtt auto discovery
        if (this._config.lights) {
            const lightsToRegister = this._config.lights;
            for (const light of lightsToRegister) {
                MqttService.getInstance().publish(
                    `${Topic.namespace}/${SubTopic.light}/${light.unique_id}/${Topic.config}`,
                    JSON.stringify(light),
                )
            }
        }
    }
}

export default LightsService;