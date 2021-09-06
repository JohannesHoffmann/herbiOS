import SerialService from "../SerialService";
import Switch from "./Switch";
import SwitchesConfig from "./SwitchesConfig";

class SwitchesService {

    private static instance: SwitchesService;
    private config: SwitchesConfig = new SwitchesConfig();

    public static getInstance(): SwitchesService {
        if (!SwitchesService.instance) {
            SwitchesService.instance = new SwitchesService();
        }
        return SwitchesService.instance;
    }

    switches: Array<Switch>= [];

    private constructor() {
        // register all available switches
        for (const switchConfiguration of this.config.get().switches) {
            this.switches.push(new Switch(switchConfiguration.switchNumber, switchConfiguration.label));
        }

        this.init();
    }


    private async init() {
        const switchData = (await SerialService.send("getSwitches")).split(",");
        if (switchData[0] === "switches") {
            const switchConfig = switchData.slice(1, -1);
            switchConfig.forEach((light, id) => {
                const state = light.split(":")[1];
                if (state === "1") {
                    this.setSwitchOn(id);
                } else {
                    this.setSwitchOff(id);
                }
            });
        }
    }

    public setSwitchOn(id: number): Switch {
        // send new dim value to device
        const config = this.config.get();
        const index = config.switches.findIndex(item => item.switchNumber === id);
        if (index !== -1) {
            this.switches[index].on();

            // Save into configs
            this.config.set(config);
            this.config.save();
            return this.switches[index];
        } 
            
        console.log("Switch", id, " is not available");
    }

    public setSwitchOff(id: number): Switch {
        // send new dim value to device
        const config = this.config.get();
        const index = config.switches.findIndex(item => item.switchNumber === id);
        if (index !== -1) {
            this.switches[index].off();

            // Save into configs
            this.config.set(config);
            this.config.save();
            return this.switches[index];
        } 
            
        console.log("Switch", id, " is not available");
    }

    
}

export default SwitchesService;