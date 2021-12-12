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
    private _changeTimeout: NodeJS.Timeout;
    
    public get mode() {
        return this._mode;
    }

    public get strength() {
        return this._strength;
    }

    private _clearJob() {
        if (this._job) {
            this._job.stop();
            this._job = undefined;
        }
    }

    public setMode(mode: FanMode) {
        this._mode = mode;

        this._clearJob();
        clearTimeout(this._changeTimeout);

        switch (mode) {
            case FanMode.off:
                SerialService.sendFastCommand("setFan -fan overhead -direction off -level 0");
                break;
            case FanMode.in:
                SerialService.sendFastCommand("setFan -fan overhead -direction off -level 0");
                this._changeTimeout = setTimeout(() => {
                    SerialService.sendFastCommand("setFan -fan overhead -direction in -level " + this._strength);
                }, 5000);
                break;
            case FanMode.out:
                SerialService.sendFastCommand("setFan -fan overhead -direction off -level 0");
                this._changeTimeout = setTimeout(() => {
                    SerialService.sendFastCommand("setFan -fan overhead -direction out -level " + this._strength);
                }, 5000);

                break;
            case FanMode.inOut:
                this._job = new CronJob("0 */2 * * * *", async () => {
                    SerialService.sendFastCommand("setFan -fan overhead -direction off -level 0");

                    if (this._modeInOut === FanMode.in) {
                        this._changeTimeout = setTimeout(() => {
                            this._modeInOut = FanMode.out;
                            SerialService.sendFastCommand("setFan -fan overhead -direction out -level " + this._strength);
                        }, 5000);

                    } else {
                        this._changeTimeout = setTimeout(() => {
                            this._modeInOut = FanMode.in;
                            SerialService.sendFastCommand("setFan -fan overhead -direction in -level " + this._strength);
                        }, 5000);
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