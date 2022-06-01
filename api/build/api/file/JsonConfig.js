"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Path = __importStar(require("path"));
const Fs = __importStar(require("fs"));
const ConfigService_1 = __importDefault(require("../../ConfigService"));
class JsonConfig {
    constructor(path) {
        this._configPath = ConfigService_1.default.getInstance().getConfig().configurationDirectory;
        this.path = Path.join(__dirname, `../../../`, this._configPath, path);
    }
    load() {
        if (Fs.existsSync(this.path)) {
            const loadedConfig = Fs.readFileSync(this.path, { encoding: "utf-8" });
            this._content = Object.assign(Object.assign({}, this._content), JSON.parse(loadedConfig));
        }
    }
    save() {
        Fs.writeFileSync(this.path, JSON.stringify(this._content, null, 4));
        return this;
    }
    set(data) {
        this._content = Object.assign(Object.assign({}, this._content), data);
        return this;
    }
    get() {
        return this._content;
    }
}
exports.default = JsonConfig;
//# sourceMappingURL=JsonConfig.js.map