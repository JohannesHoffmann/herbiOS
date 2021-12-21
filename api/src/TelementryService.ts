import Axios from 'axios';
import ConfigService from './ConfigService';
import { IGeo } from './geo/IGeo';
import GeoService from './geo/GeoService';
import NetworkingService from './networking/NetworkingService';
import RestService from './RestService';

interface ITelemetryData {
    position: IGeo,
}

class TelemetryService {

    private static instance: TelemetryService;

    public static getInstance(): TelemetryService {
        if (!TelemetryService.instance) {
         TelemetryService.instance = new TelemetryService();
        }
        return TelemetryService.instance;
    }

    private constructor() {

    }

    private _sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

    async transmit() {
        let internetOn: boolean = NetworkingService.getInstance().getConfig().cellular ? true : false;
        if (!internetOn) {
            await NetworkingService.getInstance().cellularConnect();
            await this._sleep(4000);
        }

        NetworkingService.getInstance().status();

        // DO TRANSMISSION STUFF
        let dataPackage: ITelemetryData = {
            position: GeoService.getInstance().getLastPosition(),
        };

        const token = RestService.getInstance().server.jwt.sign({type: "van", name: "herbi"});

        try {
            await Axios.post(
                ConfigService.getInstance().config.groundControl.url + "/telemetry", 
                dataPackage, 
                { 
                    headers: {
                        "Authorization": "Bearer " + token,
                    }
                }
            );
        } catch (e) {
            console.log("Could not transmit telemetry data");
        }

        // END OF DOING TRANSMISSION STUFF

        if (!internetOn) {
            // close connection after transmission if network was down before
            await NetworkingService.getInstance().cellularDisconnect();
        }

    }

}

export default TelemetryService;