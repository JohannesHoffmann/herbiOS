import { DataTypes, Model } from "sequelize";
import DatabaseService from "../DatabaseService";

class GeoLog extends Model<{
    lon: number;
    lat: number;
    speed: number;
    altitude: number;
    headingDeviation?: string;
    tourId?: number;
}
>{

}

const initGeoModel = async () => {
    await GeoLog.init({
        lon: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        lat: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        speed: {
            type: DataTypes.INTEGER,
        },
        altitude: {
            type: DataTypes.INTEGER,
        },
        headingDeviation: {
            type: DataTypes.STRING,
        },
        tourId: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
    }, {
        // Other model options go here
        sequelize: DatabaseService.getInstance().connection, // We need to pass the connection instance
        modelName: 'GeoLog' // We need to choose the model name
    });
}

  export { initGeoModel };
  export default GeoLog;