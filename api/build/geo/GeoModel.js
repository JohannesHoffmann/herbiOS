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
exports.initGeoModel = void 0;
const sequelize_1 = require("sequelize");
const DatabaseService_1 = __importDefault(require("../DatabaseService"));
class GeoLog extends sequelize_1.Model {
}
const initGeoModel = () => __awaiter(void 0, void 0, void 0, function* () {
    yield GeoLog.init({
        lon: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false
        },
        lat: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false
        },
        speed: {
            type: sequelize_1.DataTypes.INTEGER,
        },
        altitude: {
            type: sequelize_1.DataTypes.INTEGER,
        },
        headingDeviation: {
            type: sequelize_1.DataTypes.STRING,
        },
        tourId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        },
    }, {
        // Other model options go here
        sequelize: DatabaseService_1.default.getInstance().connection,
        modelName: 'GeoLog' // We need to choose the model name
    });
});
exports.initGeoModel = initGeoModel;
exports.default = GeoLog;
//# sourceMappingURL=GeoModel.js.map