import { SubTopic, Topic } from "../api/mqtt/IMqtt";
import MqttService from "../api/mqtt/MqttService";
import ConfigService from "../ConfigService";
import mqttMatch from "mqtt-match";
import { ISensorConfiguration, ISensorData } from "./ISensors";

class SensorsService {

    private static instance: SensorsService;
    private _config = ConfigService.getInstance().getConfig();

    private _data: Array<ISensorData> = [];

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

        MqttService.getInstance().onMessage((topic, message) => {
            if (mqttMatch(`${Topic.namespace}/${SubTopic.sensor}/+/${Topic.config}`, topic)) {
                const config: ISensorConfiguration = JSON.parse(message.toString());
                if (!this._data.find(s => s.unique_id === config.unique_id)) {
                    this._data.push({
                        ...config,
                        changedAt: new Date(),
                        value: 0,
                    });
                }
            }

            if (mqttMatch(`${Topic.namespace}/${SubTopic.sensor}/+/${Topic.state}`, topic)) {
                const value = message.toString();
                const unique_id = topic.split("/")[2];
                const index = this._data.findIndex(s =>  s.unique_id === unique_id);
                if (index >= 0) {
                    // Track motion sensors only when true
                    if (unique_id.startsWith("motion") && value === "false") return;

                    this._data[index].value = value;
                    this._data[index].changedAt = new Date();
                }
            }
        })
    }

    public getSensorData() {
        return this._data;
    }
}

export default SensorsService;