import ClimateConfig, { ClimateMode, IClimateConfig } from "./ClimateConfig";
import Fan, { FanMode } from "./Fan";
import Heater, { HeaterMode, HeaterStrength } from "./Heater";
import Ventilation from "./Ventilation";

class ClimateService {

    private static instance: ClimateService;

    private _heater: Heater;
    private _fan: Fan;
    private _config: ClimateConfig;
    private _ventilations: Array<Ventilation> = [];

    public static getInstance(): ClimateService {
        if (!ClimateService.instance) {
            ClimateService.instance = new ClimateService();
        }
        return ClimateService.instance;
    }

    private constructor() {
        this._heater = new Heater();
        this._fan = new Fan();
        this._config = new ClimateConfig();

        this._setHeater(this._config.get().heater.mode, this._config.get().heater.strength);

        this._config.get().ventilations.forEach(vent => {
            const newVentilation = new Ventilation(vent.id);
            newVentilation.setStrength(vent.strength);
            this._ventilations.push(newVentilation);
        })
    }


    /**
     * Sets the Heater information
     *
     * @private
     * @param {HeaterMode} mode
     * @param {HeaterStrength} [strength]
     * @memberof ClimateService
     */
    private _setHeater(mode: HeaterMode, strength?: HeaterStrength) {
        this._heater.setMode(mode);
        if (strength !== undefined) {
            this._heater.setStrength(strength);
        }
        this._config.set({
            heater: this.getHeater(),
        });
        this._config.save();
    }


    /**
     * Sets the Fan information
     *
     * @private
     * @param {FanMode} mode
     * @param {FanStrength} [strength]
     * @memberof ClimateService
     */
    private _setFan(mode: FanMode, strength?: number) {
        this._fan.setMode(mode);
        if (strength !== undefined) {
            this._fan.setStrength(strength);
        }
        this._config.set({
            fan: this.getFan(),
        });
        this._config.save();
    }

    /**
     * Set the heater from outside but only on manual mode
     *
     * @param {HeaterMode} mode
     * @param {HeaterStrength} [strength]
     * @memberof ClimateService
     */
    public setHeaterManual(args: {mode?: HeaterMode, strength?: HeaterStrength}) {
        const {mode, strength} = args;
        if (this.getMode() === ClimateMode.manual) {
            this._setHeater(mode ? mode : this.getHeater().mode, strength !== undefined ? strength : this.getHeater().strength);
            this._config.save();
            return;
        }

        console.log(`Heater can not be set manually because the current mode of climate control is ${this.getMode()}` );
    }


    /**
     * Set the fan from outside but only on manual mode
     *
     * @param {FanMode} mode
     * @param {FanStrength} [strength]
     * @memberof ClimateService
     */
    public setFanManual(args: {mode?: FanMode, strength?: number}) {
        const {mode, strength} = args;
        if (this.getMode() === ClimateMode.manual) {
            this._setFan(mode ? mode : this.getFan().mode, strength !== undefined ? strength : this.getFan().strength);
            this._config.save();
            return;
        }

        console.log(`Fan can not be set manually because the current mode of climate control is ${this.getMode()}` );
    }
 
    /**
     * Set the ventilation from outside but only on manual mode
     *
     * @param {id} id
     * @param {FanStrength} [strength]
     * @memberof ClimateService
     */
    public setVentilationManual(args: {id: string, strength: number}) {
        const {id, strength} = args;
        
        const ventilationIndex = this._ventilations.findIndex(ventis => ventis.id === id);

        if (ventilationIndex) {
            this._ventilations[ventilationIndex].setStrength(strength);
            let ventilationConfiguration = this._config.get().ventilations;
            ventilationConfiguration[ventilationIndex].id = id;
            ventilationConfiguration[ventilationIndex].strength = strength;

            this._config.set({
                ventilations: ventilationConfiguration,
            });
            this._config.save();
        }
    }

    /**
     * Get heaters status information
     *
     * @return {*}  {{mode: HeaterMode, strength: HeaterStrength}}
     * @memberof ClimateService
     */
    getHeater(): {mode: HeaterMode, strength: HeaterStrength} {
        return {
            mode: this._heater.mode,
            strength: this._heater.strength,
        }
    }

    /**
     * Get fan status information
     *
     * @return {*}  {{mode: HeaterMode, strength: HeaterStrength}}
     * @memberof ClimateService
     */
    getFan(): {mode: FanMode, strength: number} {
        return {
            mode: this._fan.mode,
            strength: this._fan.strength,
        }
    }


    public getConfig(): IClimateConfig {
        return this._config.get();
    }


    /**
     * Get the current active mode of control the temperature
     *
     * @return {*}  {ClimateMode}
     * @memberof ClimateService
     */
    getMode(): ClimateMode {
        return this._config.get().mode;
    }


    /**
     * Change the active mode of controlling the temperature
     *
     * @param {ClimateMode} mode
     * @memberof ClimateService
     */
    setMode(mode: ClimateMode) {
        this._config.set({
            mode,
        });
        this._config.save();
    }


}

export default ClimateService;