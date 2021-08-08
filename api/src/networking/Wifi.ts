import {exec} from "child_process";
import ConfigService from "../ConfigService";

class Wifi {

    isOn: boolean;

    public on(on: boolean = true) {
        this.isOn = on;
        this._do();
    }

    public off() {
        this.isOn = false;
        this._do();
    }

    private _do() {
        if (this.isOn) {
            if (ConfigService.getInstance().config.env === "development") {
                console.log("Turn WIFI on");
            } else {
                exec("sudo ifconfig wlan0 up", (error, stdout, stderr) => {
                    console.error(`exec error: ${error}`);
                    if (error) {
                        return;
                    }
                    console.log("Start wifi", stdout);
                });
            }
        } else {
            if (ConfigService.getInstance().config.env === "development") {
                console.log("Turn WIFI off");
            } else {
                exec("sudo ifconfig wlan0 down", (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        return;
                    }
                    console.log("Stop Wifi", stdout);
                });
            }

        }
    }

    public async status() {
        
    }

}

export default Wifi;