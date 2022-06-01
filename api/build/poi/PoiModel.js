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
exports.initPoiModels = void 0;
const sequelize_1 = require("sequelize");
const DatabaseService_1 = __importDefault(require("../DatabaseService"));
class PoiModel extends sequelize_1.Model {
}
const initPoiModels = () => __awaiter(void 0, void 0, void 0, function* () {
    yield PoiModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        typeId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        lon: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false
        },
        lat: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false
        },
        description: {
            type: sequelize_1.DataTypes.STRING,
        },
        tourId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        },
    }, {
        // Other model options go here
        sequelize: DatabaseService_1.default.getInstance().connection,
        modelName: 'Poi' // We need to choose the model name
    });
});
exports.initPoiModels = initPoiModels;
exports.default = PoiModel;
//# sourceMappingURL=PoiModel.js.map