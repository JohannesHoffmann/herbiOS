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
const SocketService_1 = __importDefault(require("../api/websocket/SocketService"));
const TourModel_1 = __importDefault(require("./TourModel"));
class TouringService {
    constructor() {
    }
    static getInstance() {
        if (!TouringService.instance) {
            TouringService.instance = new TouringService();
        }
        return TouringService.instance;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Init Touring Service");
            this._socket = SocketService_1.default.getInstance().getNamespace("touring");
            try {
                const runningTours = yield TourModel_1.default.findAll({ where: { endTime: null } });
                if (runningTours && runningTours.length >= 1) {
                    this._runningTour = runningTours[runningTours.length - 1];
                }
            }
            catch (e) {
                console.log("Failed loading running tour", e);
            }
        });
    }
    getActiveTour() {
        if (!this._runningTour) {
            return undefined;
        }
        return this._runningTour.get();
    }
    getActiveTourModel() {
        if (!this._runningTour) {
            return undefined;
        }
        return this._runningTour;
    }
    /**
     * Just start a tour without further input
     */
    justStartTour() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._runningTour) {
                throw Error("A tour is already running. Stop this tour first to start a  new one");
            }
            const newTour = new TourModel_1.default({
                name: "My Tour",
                startTime: new Date(),
            });
            this._runningTour = yield newTour.save();
            this._socket.updateActiveTour(this.getActiveTour());
            return this._runningTour;
        });
    }
    /**
     * Creates a tour with given values
     */
    createTour(tour) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._runningTour) {
                throw Error("A tour is already running. Stop this tour first to start a  new one");
            }
            const newTour = new TourModel_1.default(Object.assign(Object.assign({}, tour), { startTime: new Date() }));
            this._runningTour = yield newTour.save();
            this._socket.updateActiveTour(this.getActiveTour());
            return this._runningTour;
        });
    }
    /**
     * Stops a tour
     */
    stopTour() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._runningTour) {
                throw Error("There is no tour to stop");
            }
            this._runningTour.set({
                endTime: new Date(),
            });
            const endedTour = yield this._runningTour.save();
            this._runningTour = undefined;
            this._socket.updateActiveTour(undefined);
            return endedTour;
        });
    }
    /**
     * Gets a list of all tours
     * @returns
     */
    getTours() {
        return __awaiter(this, void 0, void 0, function* () {
            const tours = TourModel_1.default.findAll();
            return tours;
        });
    }
    /**
     * Get one tour by given id
     * @param id
     * @returns
     */
    getTourById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tour = yield TourModel_1.default.findByPk(id);
            return tour;
        });
    }
    /**
     * updates data of one tour by a given id
     * @param id
     * @param update
     * @returns
     */
    updateTourById(id, update) {
        return __awaiter(this, void 0, void 0, function* () {
            const tour = yield TourModel_1.default.findByPk(id);
            tour.set(update);
            yield tour.save();
            // Notify all devices when the current active tour was change
            if (tour.get().id === this.getActiveTour().id) {
                this._socket.updateActiveTour(this.getActiveTour());
            }
            return tour;
        });
    }
}
exports.default = TouringService;
//# sourceMappingURL=TouringService.js.map