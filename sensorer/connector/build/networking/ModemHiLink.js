"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CellularConnectionStatus = void 0;
const hilink_modem_1 = __importDefault(require("hilink-modem"));
const ConfigService_1 = __importDefault(require("../ConfigService"));
var CellularConnectionStatus;
(function (CellularConnectionStatus) {
    CellularConnectionStatus["connecting"] = "Connecting";
    CellularConnectionStatus["connected"] = "Connected";
    CellularConnectionStatus["disconnecting"] = "Disconnecting";
    CellularConnectionStatus["disconnected"] = "Disconnected";
    CellularConnectionStatus["failed"] = "Connection failed or disabled";
})(CellularConnectionStatus = exports.CellularConnectionStatus || (exports.CellularConnectionStatus = {}));
class ModemHiLink {
    constructor(_ip) {
        this._ip = _ip;
        this._env = "productive";
        const { env } = ConfigService_1.default.getInstance().getConfig();
        this._env = env;
        if (env !== "development") {
            this._modem = new hilink_modem_1.default({
                modemIp: this._ip,
            });
        }
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.isOn = true;
            if (this._env === "development") {
                return;
            }
            const result = yield this._modem.connect();
            console.log("Connect to cellular", result);
            return result;
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.isOn = false;
            if (this._env === "development") {
                return;
            }
            const result = yield this._modem.disconnect();
            console.log("Disconnect from cellular", result);
            return result;
        });
    }
    status() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._env === "development") {
                return {
                    maxSignal: Math.round(5 * Math.random()),
                    currentNetworkType: "LTE",
                    connectionStatus: CellularConnectionStatus.connected,
                };
            }
            try {
                const status = yield this._modem.status();
                let connectionStatus = CellularConnectionStatus.disconnected;
                switch (status["ConnectionStatus"]) {
                    case 900:
                        connectionStatus = CellularConnectionStatus.connecting;
                    case 901:
                        connectionStatus = CellularConnectionStatus.connected;
                    case 902:
                        connectionStatus = CellularConnectionStatus.disconnected;
                    case 903:
                        connectionStatus = CellularConnectionStatus.disconnecting;
                    case 904:
                        connectionStatus = CellularConnectionStatus.failed;
                }
                let networkType = "n/a";
                switch (status["CurrentNetworkType"]) {
                    case 0:
                        networkType = "No Service";
                    case 1:
                        networkType = "GSM";
                    case 2:
                        networkType = "GPRS (2.5G)";
                    case 3:
                        networkType = "EDGE (2.75G)";
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 41:
                    case 44:
                    case 45:
                    case 46:
                    case 64:
                    case 65:
                        networkType = "3G";
                    case 9:
                    case 19:
                    case 101:
                        networkType = "LTE";
                }
                return {
                    maxSignal: status["SignalIcon"],
                    connectionStatus,
                    currentNetworkType: networkType,
                };
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
exports.default = ModemHiLink;
//# sourceMappingURL=ModemHiLink.js.map