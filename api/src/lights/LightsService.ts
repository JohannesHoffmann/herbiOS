import SerialService from "../SerialService";
import Light from "./Light";
import LightsConfig from "./LightsConfig";

class LightsService {

    private static instance: LightsService;
    private config: LightsConfig = new LightsConfig();

    public static getInstance(): LightsService {
        if (!LightsService.instance) {
         LightsService.instance = new LightsService();
        }
        return LightsService.instance;
    }

    lights: Array<Light> = [];

    private constructor() {
        // register all available lights
        for (const lightConfiguration of this.config.get().lights) {
            this.lights.push(new Light(lightConfiguration.lightNumber, lightConfiguration.label));
        }

        this.init();
    }

    private async init() {
        const lightsData = (await SerialService.send("getLights")).split(",");
        if (lightsData[0] === "lights") {
            const lights = lightsData.slice(1, -1);
            lights.forEach((light, id) => {
                const level = light.split(":")[1];
                this.setLightLevel(id, Number(level));
            });
        }
    }

    setLightLevel(lightId: number, dim: number): Light {
        // send new dim value to device
        const config = this.config.get();
        const index = config.lights.findIndex(light => light.lightNumber === lightId);
        if (index !== -1) {
            this.lights[index].dim(dim);
            config.lights[index].level = dim;

            // Save into configs
            this.config.set(config);
            this.config.save();
            return this.lights[index];
        } 
            
        console.log("Light", lightId, " is not available");
    }
}

export default LightsService;