import Axios from 'axios';
import ConfigService from './ConfigService';
import { IGeo } from './geo/IGeo';
import GeoService from './geo/GeoService';
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
    }

}

export default TelemetryService;