import { Association, DataTypes, HasManyAddAssociationMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, Model } from "sequelize";
import DatabaseService from "../DatabaseService";
import GeoLog from "../geo/GeoModel";

export interface ITour {
    id: number;
    name: string;
    startTime: Date;
    endTime?: Date;
    description?: string;
}

class TourModel extends Model<ITour, Omit<ITour, "id">>{


    public getGeoLogs!: HasManyGetAssociationsMixin<GeoLog>; // Note the null assertions!
    public addGeoLog!: HasManyAddAssociationMixin<GeoLog, number>;
    public hasGeoLog!: HasManyHasAssociationMixin<GeoLog, number>;
    public countGeoLogs!: HasManyCountAssociationsMixin;
    public createGeoLog!: HasManyCreateAssociationMixin<GeoLog>;

    public static associations: {
        projects: Association<TourModel, GeoLog>;
    };
}

const initTourModel = async () => {
    TourModel.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
        type: DataTypes.STRING,
        allowNull: false,
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endTime: {
        type: DataTypes.DATE,
        },
        description: {
            type: DataTypes.STRING,
        },
    }, {
        // Other model options go here
        sequelize: DatabaseService.getInstance().connection, // We need to pass the connection instance
        modelName: 'Tour' // We need to choose the model name
    });
    TourModel.hasMany(GeoLog, {
        sourceKey: "id",
        foreignKey: "tourId",
        as: "geoLogs", // this determines the name in `associations`!
      });
}


  export { initTourModel };
  export default TourModel;