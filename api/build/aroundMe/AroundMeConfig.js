"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JsonConfig_1 = __importDefault(require("../api/file/JsonConfig"));
class AroundMeConfig extends JsonConfig_1.default {
    constructor() {
        super("aroundMe.json");
        this._content = {};
        this.load();
    }
}
exports.default = AroundMeConfig;
//# sourceMappingURL=AroundMeConfig.js.map