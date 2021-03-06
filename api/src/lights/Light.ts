import SerialService from "../SerialService";

class Light {
    name: string;
    id: Number;
    level: number = 0; // light level in percent

    constructor(id: number, name: string) {
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

        // do serialport stuff here to send light level
        SerialService.sendFastCommand("setLight -light " + this.id + " -level " + Math.round(255/100 * this.level));
        
        return this.level;
    }

}

export default Light;