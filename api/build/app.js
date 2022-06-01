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
const AudioService_1 = __importDefault(require("./audio/AudioService"));
const DatabaseService_1 = __importDefault(require("./DatabaseService"));
const AppService_1 = __importDefault(require("./app/AppService"));
const RestService_1 = __importDefault(require("./RestService"));
const GeoService_1 = __importDefault(require("./geo/GeoService"));
const LightsService_1 = __importDefault(require("./lights/LightsService"));
const ClimateService_1 = __importDefault(require("./climate/ClimateService"));
const ConfigService_1 = __importDefault(require("./ConfigService"));
const SocketService_1 = __importDefault(require("./api/websocket/SocketService"));
const AroundMeService_1 = __importDefault(require("./aroundMe/AroundMeService"));
const TouringService_1 = __importDefault(require("./touring/TouringService"));
const PoiService_1 = __importDefault(require("./poi/PoiService"));
const MqttService_1 = __importDefault(require("./api/mqtt/MqttService"));
const SensorsService_1 = __importDefault(require("./sensors/SensorsService"));
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    ConfigService_1.default.getInstance();
    yield DatabaseService_1.default.getInstance().init();
    RestService_1.default.getInstance().start();
    MqttService_1.default.getInstance().init();
    SocketService_1.default.getInstance().init(RestService_1.default.getInstance().getServer());
    AudioService_1.default.getInstance();
    ClimateService_1.default.getInstance();
    AppService_1.default.getInstance();
    LightsService_1.default.getInstance().init();
    SensorsService_1.default.getInstance().init();
    yield TouringService_1.default.getInstance().init();
    yield GeoService_1.default.getInstance().init();
    yield PoiService_1.default.getInstance().init();
    AroundMeService_1.default.getInstance();
});
start();
//# sourceMappingURL=app.js.map