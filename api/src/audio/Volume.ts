import {exec} from "child_process";
import ConfigService from "../ConfigService";

class Volume {

    level: number;

    public set(level: number) {
        this.level = level;
        this._do();
    }

    private _do() {
            if (ConfigService.getInstance().config.env === "development") {
                console.log(`Turn Volume to ${this.level}%`);
            } else {
                exec("amixer sset Digital " + this.level + "%", (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        return;
                    }
                    console.log("Set volume to " + this.level + "%", stdout);
                });
            }

    }

}

export default Volume;