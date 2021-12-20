import MQTT from "mqtt";
import ConfigService from "../../ConfigService";

/**
 * Service to manage mqtt subscriptions
 *
 * @class MqttService
 */
class MqttService {

    private static instance: MqttService;

    private _client: MQTT.MqttClient;
    private _subscriptionsBeforeConnected: Array<string> = [];
    private _config = ConfigService.getInstance().getConfig();


    public static getInstance(): MqttService {
        if (!MqttService.instance) {
            MqttService.instance = new MqttService();
        }

        return MqttService.instance;
    }

    private constructor () {}

    /**
     * initiate the mqtt client
     *
     * @memberof MqttService
     */
    public async init () {
        const port = this._config.mqtt.port ? this._config.mqtt.port : 1883;
        this._client = MQTT.connect(`mqtt://${this._config.mqtt.host}:${port}`, {
            username: this._config.mqtt.username,
            password: this._config.mqtt.password,
        });

        this._client.on('connect', () => {
            for (const subscribe of this._subscriptionsBeforeConnected) {
                this.subscribe(subscribe);
            }
        });
    }

    
    /**
     * Subscribe to a topic
     * @param topic 
     */
    public subscribe(topic: string | Array<string>) {
        if (!this._client.connected) {
            this._subscriptionsBeforeConnected = [
                ...this._subscriptionsBeforeConnected,
                ...Array.isArray(topic) ? topic : [topic],
            ];
            return;
        }

        this._client.subscribe(topic, function (err) {
            if (err) {
                console.log(`Error to subscribe ${topic}`, err);
            }
        });
    }
    
    /**
     * Unsubscribe to a topic
     * @param topic 
     */
    public unsubscribe(topic: string | Array<string>) {
        this._client.unsubscribe(topic, function (err) {
            if (err) {
                console.log(`Error to subscribe ${topic}`, err);
            }
        });
    }

    /**
     * callback for onMessage
     * @param callback 
     */
    public onMessage(callback: (topic: string, message: string) => void) {
        this._client.on("message", callback);
    }

    /**
     * publish a topic change
     * @param callback 
     */
    public publish(topic: string, message: string) {
        this._client.publish(
            topic,
            message,
            {
                retain: true,
            }
        );
    }



}

export default MqttService;