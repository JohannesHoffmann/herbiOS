import SerialService from "../SerialService";

class Light {
    name: string;
    id: string;
    level: number = 0; // light level in percent

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }


    /**
     * Dims the light to a specific level
     *
     * @param {number} value
     * @return {*}  {number}
     * @memberof Light
     */
    dim(value: number): number {
        if (value > 100) {
            value = 100;
        } else if (value <0 ) {
            value = 0;
        }

        if (value === this.level) {
            return this.level;
        }

        this.level = value;

        // get the hardware id of the firmware from the lightId
        let id = Number(this.id[this.id.length - 1]) - 1;

        // do serialport stuff here to send light level
        SerialService.send("setLight -light " + id + " -level " + Math.round(255/100 * this.level));
        
        return this.level;
    }

}

export default Light;