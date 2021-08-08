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

    lights: {[key: string]: Light} = {};

    private constructor() {
        // register all available lights
        for (const [lightId, lightConfiguration]of Object.entries(this.config.get().lights)) {
            this.lights[lightId] = new Light(lightId, lightConfiguration.label);
            this.setLightLevel(lightId, lightConfiguration.level);
        }
    }

    setLightLevel(lightId: string, dim: number): Light {
        if (this.lights.hasOwnProperty(lightId)) {
            // send new dim value to device
            this.lights[lightId].dim(dim);

            const config = this.config.get();

            // Save into configs
            this.config.set({
                lights: {
                    ...config.lights,
                    [lightId]: {
                        ...config.lights[lightId] ? config.lights[lightId] : { label: lightId},
                        level: dim
                    },
                }
            });
            this.config.save();

            return this.lights[lightId];
        } else {
            console.log("Light", lightId, " is not available");
        }
    }
}

export default LightsService;