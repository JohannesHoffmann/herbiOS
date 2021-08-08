import VitalsDao, { IVitals } from "../dao/VitalsDao";


class VitalsService {

    private _vitals: IVitals;

    constructor() {
        this._vitals = VitalsDao.getVitals();
    }

}

export default new VitalsService();