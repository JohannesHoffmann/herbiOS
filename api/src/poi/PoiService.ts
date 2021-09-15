import SocketService from "../api/websocket/SocketService";
import PoiSocket from "./PoiSocket";
import PoiModel, { IPoiCreate } from "./PoiModel";
import TouringService from "../touring/TouringService";
import GeoService from "../geo/GeoService";


class PoiService {

    private static instance: PoiService;
    private _socket: PoiSocket;

    public static getInstance(): PoiService {
        if (!PoiService.instance) {
         PoiService.instance = new PoiService();
        }
        return PoiService.instance;
    }

    private constructor() {

    }

    public async init() {
        this._socket = SocketService.getInstance().getNamespace("pois")
    }

    /**
     * Creates a poi with given values
     */
    public async createPoi(poi: IPoiCreate) {
        const activeTour = TouringService.getInstance().getActiveTour();
        const currentGeo = await GeoService.getInstance().getGeo();

        const newPoi = new PoiModel({
            ...poi,
            lat: currentGeo.lat,
            lon: currentGeo.lon,
            tourId: activeTour ? activeTour.id : null,
        });

        await newPoi.save();
        return newPoi;
    }

    /**
     * Gets a list of all pois
     * @returns 
     */
    public async getPois() {
        return await PoiModel.findAll();
    }


    /**
     * Get one poi by given id
     * @param id 
     * @returns 
     */
    public async getPoiById(id: number) {
        const poi = await PoiModel.findByPk(id);
        return poi;
    }

    /**
     * updates data of one poi by a given id
     * @param id 
     * @param update 
     * @returns 
     */
    public async updatePoiById(id: number, update: Partial<IPoiCreate>) {
        const poi = await PoiModel.findByPk(id);
        poi.set(update);
        await poi.save();
        return poi;
    }


}

export default PoiService;