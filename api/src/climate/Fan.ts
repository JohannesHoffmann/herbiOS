import SerialService from "../SerialService";
import {CronJob} from "cron";

export enum FanMode {
    in = "in",
    out = "out",
    off = "off",
    inOut= "inOut",
}

export default class Fan {

    private _mode: FanMode = FanMode.off;
    private _strength: number;
    private _job: CronJob;
    private _modeInOut: FanMode = FanMode.in;
    
    public get mode() {
        return this._mode;
    }

    public get strength() {
        return this._strength;
    }

    public setMode(mode: FanMode) {
        this._mode = mode;

        switch (mode) {
            case FanMode.off:
                SerialService.send("setFan -fan overhead -direction off -level 0");
                if (this._job) {
                    this._job.stop();
                    console.log("fan cron stop");
                }
                break;
            case FanMode.in:
                SerialService.send("setFan -fan overhead -direction in -level " + this._strength);
                if (this._job) {
                    this._job.stop();
                    console.log("fan cron stop");
                }
                break;
            case FanMode.out:
                SerialService.send("setFan -fan overhead -direction out -level " + this._strength);
                if (this._job) {
                    this._job.stop();
                    console.log("fan cron stop");
                }
                break;
            case FanMode.inOut:
                this._job = new CronJob("0 */2 * * * *", async () => {
                    if (this._modeInOut === FanMode.in) {
                        this._modeInOut = FanMode.out;
                        SerialService.send("setFan -fan overhead -direction out -level " + this._strength);
                    } else {
                        this._modeInOut = FanMode.in;
                        SerialService.send("setFan -fan overhead -direction in -level " + this._strength);
                    }
                });
                this._job.start();
                break;
        }
    }

    public setStrength(strength: number) {
        this._strength = strength;
        this.setMode(this._mode);
    }

}