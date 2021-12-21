import { SubTopic, Topic } from "../api/mqtt/IMqtt";
import MqttService from "../api/mqtt/MqttService";
import ConfigService from "../ConfigService";

class ClimateService {

    private static instance: ClimateService;
    private _config = ConfigService.getInstance().getConfig();

    public static getInstance(): ClimateService {
        if (!ClimateService.instance) {
         ClimateService.instance = new ClimateService();
        }
        return ClimateService.instance;
    }

    private constructor() {
        this.init();
    }

    public async init() {

        // Register manual configured fans to mqtt auto discovery
        if (this._config.fans) {
            const climatesToRegister = this._config.switches;
            for (const climate of climatesToRegister) {
                MqttService.getInstance().publish(
                    `${Topic.namespace}/${SubTopic.climate}/${climate.unique_id}/${Topic.config}`,
                    JSON.stringify(climate),
                )
            }
        }
    }
}

export default ClimateService;