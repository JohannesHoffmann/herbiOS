import { SubTopic, Topic } from "../api/mqtt/IMqtt";
import MqttService from "../api/mqtt/MqttService";
import ConfigService from "../ConfigService";
import { NetworkingTopics } from "./INetworking";

class NetworkingService {

    private static instance: NetworkingService;
    private _config = ConfigService.getInstance().getConfig();

    public static getInstance(): NetworkingService {
        if (!NetworkingService.instance) {
         NetworkingService.instance = new NetworkingService();
        }
        return NetworkingService.instance;
    }

    private constructor() {
        this.init();
    }

    public async init() {

        // Register manual configured lights to mqtt auto discovery
        if (this._config.networking) {
            
            // Apply interfaces
            if (this._config.networking.interfaces) {
                const interfacesToRegister = this._config.networking.interfaces;
                for (const inf of interfacesToRegister) {
                    MqttService.getInstance().publish(
                        `${Topic.namespace}/${SubTopic.networking}/${NetworkingTopics.interface}/${inf.unique_id}/${Topic.config}`,
                        JSON.stringify(inf),
                    )
                }
            }

            // Apply modems
            if (this._config.networking.modems) {
                const modemsToRegister = this._config.networking.modems;
                for (const modem of modemsToRegister) {
                    MqttService.getInstance().publish(
                        `${Topic.namespace}/${SubTopic.networking}/${NetworkingTopics.modem}/${modem.unique_id}/${Topic.config}`,
                        JSON.stringify(modem),
                    )
                }
            }


        }
    }
}

export default NetworkingService;