import { Model, Sequelize } from 'sequelize';
import ConfigService from './ConfigService';
import GeoLog, { initGeoModel } from './geo/GeoModel';
import PoiModel, { initPoiModels } from './poi/PoiModel';
import TourModel, { initTourModel } from './touring/TourModel';

class DatabaseService {

    private static instance: DatabaseService;

    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
         DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    databaseConnectionString: string;
    private _connection: Sequelize;

    private constructor() {
        this.databaseConnectionString = ConfigService.getInstance().getConfig().database;
    }

    async init () {
        try {
            this._connection = new Sequelize(this.databaseConnectionString) // Example for sqlite
            await this._connection.authenticate();

            // Register models
            await initGeoModel();
            await initPoiModels();
            await initTourModel();

            const update = false;
            if (update) {
                await TourModel.sync({ alter: true });
                await GeoLog.sync({alter: true});
                await PoiModel.sync({alter: true});
            }

            // Syncing table structure
            // this._connection.sync();
         } catch (e) {
            console.log("Database connection could not be established", e);
        }
    }

    get connection(): Sequelize {
        return this._connection
    }

}

export default DatabaseService;