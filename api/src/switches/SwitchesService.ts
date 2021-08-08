import ControlsDao, { IControl } from "../dao/ControlsDao";
import SerialService from "../SerialService";
import WebSocketService from "../WebSocketService";

class SwitchesService {

    private static instance: SwitchesService;

    public static getInstance(): SwitchesService {
        if (!SwitchesService.instance) {
            SwitchesService.instance = new SwitchesService();
        }
        return SwitchesService.instance;
    }

    water: IControl["switches"]["water"] = true;
    powerInverter: IControl["switches"]["powerInverter"] = false;

    private constructor() {

        this.water = ControlsDao.getControls().switches.water;
        this.powerInverter = ControlsDao.getControls().switches.powerInverter;

        // Register websocket message
        WebSocketService.getInstance().onMessage("setSwitch", (payload) => {
            console.log("Change switch", payload);
            this.setSwitch(payload.mode, payload.step);
        })
    }

    setSwitch(name: keyof IControl["switches"], mode: unknown) {

        switch (name) {
            case "powerInverter":
                SerialService.send("setSwitch -name 230V -mode " + mode ? "on" : "off");
                break;
                
            default:
                SerialService.send("setSwitch -name " + name + " -mode " + mode ? "on" : "off");
                break;
        }

        ControlsDao.setControls({
            switches: {
                ...ControlsDao.getControls().switches,
                [name]: mode,
            }
        })

        WebSocketService.getInstance().sendToAll({
            type: "setControl",
            payload:  ControlsDao.getControls(),
        });
    }
}

export default SwitchesService;