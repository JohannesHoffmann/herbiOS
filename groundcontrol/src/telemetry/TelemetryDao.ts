import * as Path from 'path';
import * as Fs from 'fs';
import ConfigService from '../ConfigService';

export interface IGeo {
    status: number,
    dateTime: Date,
    lat: number,
    lon: number,
    headingDeviation: string,
    speed: number,
    altitude: number,
    satellites: number,
}

export interface ITelemetry {
    dateTime: Date;
    position: IGeo,
}

class TelemetryDao {

    private configPath;
    private dataLimit: number = 1000;
    private telemetries: Array<ITelemetry> = [];

    constructor() {
        this.configPath = Path.join(__dirname, `../../`, ConfigService.getInstance().getConfig().dataStorage.telemetry);
        // load last data
        if (Fs.existsSync(this.configPath)) {
            const loadedConfig = Fs.readFileSync(this.configPath, {encoding: "utf-8"});
            this.telemetries = [
                ...this.telemetries,
                ...JSON.parse(loadedConfig)
            ];
        }
        this.save();

    }

    private save() {
        Fs.writeFileSync(this.configPath, JSON.stringify(this.telemetries, null, 4));
    }

    public get(): Array<ITelemetry> {
        return this.telemetries;
    }

    public set(data: ITelemetry): ITelemetry {
        this.telemetries.push(data);
        if (this.telemetries.length > this.dataLimit) {
            this.telemetries = this.telemetries.slice(this.telemetries.length - this.dataLimit, this.telemetries.length);
        }
        this.save();
        return data;
    }

}

export default new TelemetryDao();