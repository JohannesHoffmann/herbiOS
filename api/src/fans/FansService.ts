import { SubTopic, Topic } from "../api/mqtt/IMqtt";
import MqttService from "../api/mqtt/MqttService";
import ConfigService from "../ConfigService";

class FansService {

    private static instance: FansService;
    private _config = ConfigService.getInstance().getConfig();

    public static getInstance(): FansService {
        if (!FansService.instance) {
         FansService.instance = new FansService();
        }
        return FansService.instance;
    }

    private constructor() {
        this.init();
    }

    public async init() {

        // Register manual configured fans to mqtt auto discovery
        if (this._config.fans) {
            const switchesToRegister = this._config.switches;
            for (const sw of switchesToRegister) {
                MqttService.getInstance().publish(
                    `${Topic.namespace}/${SubTopic.fan}/${sw.unique_id}/${Topic.config}`,
                    JSON.stringify(sw),
                )
            }
        }
    }
}

export default FansService;