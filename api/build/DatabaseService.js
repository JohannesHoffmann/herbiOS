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
const sequelize_1 = require("sequelize");
const ConfigService_1 = __importDefault(require("./ConfigService"));
const GeoModel_1 = __importStar(require("./geo/GeoModel"));
const PoiModel_1 = __importStar(require("./poi/PoiModel"));
const TourModel_1 = __importStar(require("./touring/TourModel"));
class DatabaseService {
    constructor() {
        this.databaseConnectionString = ConfigService_1.default.getInstance().getConfig().database;
    }
    static getInstance() {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._connection = new sequelize_1.Sequelize(this.databaseConnectionString); // Example for sqlite
                yield this._connection.authenticate();
                // Register models
                yield GeoModel_1.initGeoModel();
                yield PoiModel_1.initPoiModels();
                yield TourModel_1.initTourModel();
                const update = false;
                if (update) {
                    yield TourModel_1.default.sync({ alter: true });
                    yield GeoModel_1.default.sync({ alter: true });
                    yield PoiModel_1.default.sync({ alter: true });
                }
                // Syncing table structure
                this._connection.sync();
            }
            catch (e) {
                console.log("Database connection could not be established", e);
            }
        });
    }
    get connection() {
        return this._connection;
    }
}
exports.default = DatabaseService;
//# sourceMappingURL=DatabaseService.js.map