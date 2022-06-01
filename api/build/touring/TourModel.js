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
exports.initTourModel = void 0;
const sequelize_1 = require("sequelize");
const DatabaseService_1 = __importDefault(require("../DatabaseService"));
const GeoModel_1 = __importDefault(require("../geo/GeoModel"));
const PoiModel_1 = __importDefault(require("../poi/PoiModel"));
class TourModel extends sequelize_1.Model {
}
const initTourModel = () => __awaiter(void 0, void 0, void 0, function* () {
    yield TourModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        startTime: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        endTime: {
            type: sequelize_1.DataTypes.DATE,
        },
        description: {
            type: sequelize_1.DataTypes.STRING,
        },
    }, {
        // Other model options go here
        sequelize: DatabaseService_1.default.getInstance().connection,
        modelName: 'Tour' // We need to choose the model name
    });
    TourModel.hasMany(GeoModel_1.default, {
        sourceKey: "id",
        foreignKey: "tourId",
        as: "geoLogs", // this determines the name in `associations`!
    });
    TourModel.hasMany(PoiModel_1.default, {
        sourceKey: "id",
        foreignKey: "tourId",
        as: "pois", // this determines the name in `associations`!
    });
});
exports.initTourModel = initTourModel;
exports.default = TourModel;
//# sourceMappingURL=TourModel.js.map