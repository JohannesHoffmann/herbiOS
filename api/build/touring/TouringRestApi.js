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
const TouringService_1 = __importDefault(require("./TouringService"));
function registerTouringEndpoints(server) {
    server.get("/touring/just-start", function (request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const startedTour = yield TouringService_1.default.getInstance().justStartTour();
            response.status(200).send(startedTour);
        });
    });
    server.get("/touring/active", function (request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const activeTour = yield TouringService_1.default.getInstance().getActiveTourModel();
            response.status(200).send({
                tour: activeTour.get(),
                route: yield activeTour.getGeoLogs(),
            });
        });
    });
    server.get("/touring/stop", function (request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const stoppedTour = yield TouringService_1.default.getInstance().stopTour();
            response.status(200).send(stoppedTour);
        });
    });
    server.get("/touring/tours", function (request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const tours = yield TouringService_1.default.getInstance().getTours();
            response.status(200).send(tours);
        });
    });
    server.route({
        method: 'GET',
        url: '/touring/tour/:id',
        schema: {
            params: {
                id: { type: 'number' },
            },
            response: 200,
        },
        handler: function (request, response) {
            return __awaiter(this, void 0, void 0, function* () {
                const tour = yield TouringService_1.default.getInstance().getTourById(request.params.id);
                response.status(200).send({
                    tour: tour.get(),
                    route: yield tour.getGeoLogs(),
                    pois: yield tour.getPois(),
                });
            });
        }
    });
    server.route({
        method: 'PUT',
        url: '/touring/tour/:id',
        schema: {
            params: {
                id: { type: 'number' },
            },
            body: {
                name: { type: "string" },
                description: { type: "string" },
            },
            response: 200,
        },
        handler: function (request, response) {
            return __awaiter(this, void 0, void 0, function* () {
                const tour = yield TouringService_1.default.getInstance().updateTourById(request.params.id, request.body);
                response.status(200).send({
                    tour: tour.get(),
                    route: yield tour.getGeoLogs(),
                    pois: yield tour.getPois(),
                });
            });
        }
    });
    server.route({
        method: 'POST',
        url: '/touring/tour',
        schema: {
            body: {
                name: { type: "string" },
                description: { type: "string" },
                startTime: { type: "string" },
            },
            response: 200,
        },
        handler: function (request, response) {
            return __awaiter(this, void 0, void 0, function* () {
                const tour = yield TouringService_1.default.getInstance().createTour(request.body);
                response.status(200).send({
                    tour: tour.get(),
                    route: yield tour.getGeoLogs(),
                    pois: yield tour.getPois(),
                });
            });
        }
    });
}
exports.default = registerTouringEndpoints;
//# sourceMappingURL=TouringRestApi.js.map