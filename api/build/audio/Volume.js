"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const ConfigService_1 = __importDefault(require("../ConfigService"));
class Volume {
    set(level) {
        this.level = level;
        this._do();
    }
    _do() {
        if (ConfigService_1.default.getInstance().config.env === "development") {
            console.log(`Turn Volume to ${this.level}%`);
        }
        else {
            child_process_1.exec("amixer sset Digital " + this.level + "%", (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                console.log("Set volume to " + this.level + "%", stdout);
            });
        }
    }
}
exports.default = Volume;
//# sourceMappingURL=Volume.js.map