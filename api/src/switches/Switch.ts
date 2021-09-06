import SerialService from "../SerialService";

class Switch {
    name: string;
    id: Number;
    isOn: boolean = false;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }


    /**
     * Turns switch on
     *
     * @param {number} value
     * @return {*}  {number}
     * @memberof Light
     */
    on(): boolean {
        if (this.isOn) {
            return this.isOn;
        }

        this.isOn = true;

        // do serialport stuff here to send light level
        SerialService.sendFastCommand("setSwitch -switch " + this.id + " -state on");
        
        return this.isOn;
    }

    /**
     * Turns switch off
     *
     * @param {number} value
     * @return {*}  {number}
     * @memberof Light
     */
    off(): boolean {
        if (!this.isOn) {
            return this.isOn;
        }

        this.isOn = false;

        // do serialport stuff here to send light level
        SerialService.sendFastCommand("setSwitch -switch " + this.id + " -state off");
        
        return this.isOn;
    }

}

export default Switch;