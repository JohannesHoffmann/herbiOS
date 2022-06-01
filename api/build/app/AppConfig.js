"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleModes = void 0;
const JsonConfig_1 = __importDefault(require("../api/file/JsonConfig"));
var VehicleModes;
(function (VehicleModes) {
    VehicleModes["tour"] = "tour";
    VehicleModes["parking"] = "parking";
    VehicleModes["longParking"] = "long-parking";
})(VehicleModes = exports.VehicleModes || (exports.VehicleModes = {}));
class AppConfig extends JsonConfig_1.default {
    constructor() {
        super("app.json");
        this._content = {
            vehicleMode: VehicleModes.tour,
        };
        this.load();
    }
}
exports.default = AppConfig;
//# sourceMappingURL=AppConfig.js.map