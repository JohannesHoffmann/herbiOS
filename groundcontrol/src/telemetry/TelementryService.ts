import ConfigService from '../ConfigService';

import TelemetryDao, {ITelemetry} from "./TelemetryDao"


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

    public setTelemetry(data: Omit<ITelemetry, "dateTime">) {
        const newTelemetry: ITelemetry = {
            ...data,
            dateTime: new Date(),
        }

        TelemetryDao.set(newTelemetry);
    }

    public getTelemetry(): Array<ITelemetry> {
        return TelemetryDao.get();
    }
    


}

export default TelemetryService;