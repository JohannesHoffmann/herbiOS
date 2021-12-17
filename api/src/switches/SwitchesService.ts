import { SubTopic, Topic } from "../api/mqtt/IMqtt";
import MqttService from "../api/mqtt/MqttService";
import ConfigService from "../ConfigService";

class SwitchesService {

    private static instance: SwitchesService;
    private _config = ConfigService.getInstance().getConfig();

    public static getInstance(): SwitchesService {
        if (!SwitchesService.instance) {
         SwitchesService.instance = new SwitchesService();
        }
        return SwitchesService.instance;
    }

    private constructor() {
        this.init();
    }

    public async init() {

        // Register manual configured switches to mqtt auto discovery
        if (this._config.switches) {
            const switchesToRegister = this._config.switches;
            for (const sw of switchesToRegister) {
                MqttService.getInstance().publish(
                    `${Topic.namespace}/${SubTopic.switch}/${sw.unique_id}/${Topic.config}`,
                    JSON.stringify(sw),
                )
            }
        }
    }
}

export default SwitchesService;