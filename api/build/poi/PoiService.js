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
const SocketService_1 = __importDefault(require("../api/websocket/SocketService"));
const PoiModel_1 = __importDefault(require("./PoiModel"));
const TouringService_1 = __importDefault(require("../touring/TouringService"));
const GeoService_1 = __importDefault(require("../geo/GeoService"));
class PoiService {
    constructor() {
    }
    static getInstance() {
        if (!PoiService.instance) {
            PoiService.instance = new PoiService();
        }
        return PoiService.instance;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this._socket = SocketService_1.default.getInstance().getNamespace("pois");
        });
    }
    /**
     * Creates a poi with given values
     */
    createPoi(poi) {
        return __awaiter(this, void 0, void 0, function* () {
            const activeTour = TouringService_1.default.getInstance().getActiveTour();
            const currentGeo = yield GeoService_1.default.getInstance().getGeo();
            const newPoi = new PoiModel_1.default(Object.assign(Object.assign({}, poi), { lat: currentGeo.lat, lon: currentGeo.lon, tourId: activeTour ? activeTour.id : null }));
            yield newPoi.save();
            return newPoi;
        });
    }
    /**
     * Gets a list of all pois
     * @returns
     */
    getPois() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PoiModel_1.default.findAll();
        });
    }
    /**
     * Get one poi by given id
     * @param id
     * @returns
     */
    getPoiById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const poi = yield PoiModel_1.default.findByPk(id);
            return poi;
        });
    }
    /**
     * updates data of one poi by a given id
     * @param id
     * @param update
     * @returns
     */
    updatePoiById(id, update) {
        return __awaiter(this, void 0, void 0, function* () {
            const poi = yield PoiModel_1.default.findByPk(id);
            poi.set(update);
            yield poi.save();
            return poi;
        });
    }
}
exports.default = PoiService;
//# sourceMappingURL=PoiService.js.map