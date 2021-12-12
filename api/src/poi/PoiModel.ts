import { DataTypes, Model } from "sequelize";
import DatabaseService from "../DatabaseService";

export interface IPoi {
    id: number;
    typeId: number;
    name: string;
    description?: string;
    lon: number;
    lat: number;
    tourId?: number;
}

export interface IPoiCreate extends Omit<IPoi, "id" | "tourId" | "lat" | "lon"> {
    
}

class PoiModel extends Model<IPoi, Omit<IPoi, "id">>{

}

const initPoiModels = async () => {
    await PoiModel.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        typeId: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lon: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        lat: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
        },
        tourId: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
    }, {
        // Other model options go here
        sequelize: DatabaseService.getInstance().connection, // We need to pass the connection instance
        modelName: 'Poi' // We need to choose the model name
    });
}


  export { initPoiModels };
  export default PoiModel;