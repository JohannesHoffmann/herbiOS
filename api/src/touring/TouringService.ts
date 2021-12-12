
import SocketService from "../api/websocket/SocketService";
import TourSocket from "./TouringSocket";
import TourModel, { ITour } from "./TourModel";


class TouringService {

    private static instance: TouringService;
    private _runningTour: TourModel;
    private _socket: TourSocket;

    public static getInstance(): TouringService {
        if (!TouringService.instance) {
         TouringService.instance = new TouringService();
        }
        return TouringService.instance;
    }

    private constructor() {

    }

    public async init() {
        console.log("Init Touring Service");
        this._socket = SocketService.getInstance().getNamespace("touring");
        try {
            const runningTours = await TourModel.findAll({where: {endTime: null}});
            this._runningTour = runningTours[runningTours.length - 1];
        } catch (e) {
            console.log("Failed loading running tour", e);
        }
    }


    public getActiveTour() {
        if (!this._runningTour) {
            return undefined;
        }
        return this._runningTour.get();
    }


    public getActiveTourModel() {
        if (!this._runningTour) {
            return undefined;
        }
        return this._runningTour;
    }


    /**
     * Just start a tour without further input
     */
    public async justStartTour() {
        if (this._runningTour) {
            throw Error("A tour is already running. Stop this tour first to start a  new one");
        }

        const newTour = new TourModel({
            name: "My Tour",
            startTime: new Date(),
        });

        this._runningTour = await newTour.save();
        this._socket.updateActiveTour(this.getActiveTour());
        return this._runningTour;
    }


    /**
     * Creates a tour with given values
     */
    public async createTour(tour: Omit<ITour, "id">) {
        if (this._runningTour) {
            throw Error("A tour is already running. Stop this tour first to start a  new one");
        }

        const newTour = new TourModel({
            ...tour,
            startTime: new Date(),
        });

        this._runningTour = await newTour.save();
        this._socket.updateActiveTour(this.getActiveTour());
        return this._runningTour;
    }


    /**
     * Stops a tour
     */
    public async stopTour() {
        if (!this._runningTour) {
            throw Error("There is no tour to stop");
        }

        this._runningTour.set({
            endTime: new Date(),
        });
        const endedTour = await this._runningTour.save();
        this._runningTour = undefined;
        this._socket.updateActiveTour(undefined);
        return endedTour;
    }

    /**
     * Gets a list of all tours
     * @returns 
     */
    public async getTours() {
        const tours = TourModel.findAll();
        return tours;
    }


    /**
     * Get one tour by given id
     * @param id 
     * @returns 
     */
    public async getTourById(id: number) {
        const tour = await TourModel.findByPk(id);
        return tour;
    }

    /**
     * updates data of one tour by a given id
     * @param id 
     * @param update 
     * @returns 
     */
    public async updateTourById(id: number, update: Partial<ITour>) {
        const tour = await TourModel.findByPk(id);
        tour.set(update);
        await tour.save();

        // Notify all devices when the current active tour was change
        if (tour.get().id === this.getActiveTour().id) {
            this._socket.updateActiveTour(this.getActiveTour());
        }

        return tour;
    }


}

export default TouringService;