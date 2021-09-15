import { FastifyInstance } from 'fastify';
import TouringService from './TouringService';
import { ITour } from './TourModel';

export default function registerTouringEndpoints(server: FastifyInstance) {

    server.get("/touring/just-start", async function (request, response) {
        const startedTour = await TouringService.getInstance().justStartTour();
        response.status(200).send(startedTour);
    });

    server.get("/touring/active", async function (request, response) {
        const activeTour = await TouringService.getInstance().getActiveTourModel();
        response.status(200).send({
            tour: activeTour.get(),
            route: await activeTour.getGeoLogs(),
        });
    });

    server.get("/touring/stop", async function (request, response) {
        const stoppedTour = await TouringService.getInstance().stopTour();
        response.status(200).send(stoppedTour);
    });

    server.get("/touring/tours", async function (request, response) {
        const tours = await TouringService.getInstance().getTours();
        response.status(200).send(tours);
    });

    server.route<{Params: { id: number; }}>({
        method: 'GET',
        url: '/touring/tour/:id',
        schema: {
            params: {
                id: { type: 'number' },
            },
            response: 200,
        },
        handler: async function (request, response) {
            const tour = await TouringService.getInstance().getTourById(request.params.id);
            response.status(200).send({
                tour: tour.get(),
                route: await tour.getGeoLogs(),
            });
        }
    
    });


    server.route<{Params: { id: number; }, Body: Partial<ITour>}>({
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
        handler: async function (request, response) {
            const tour = await TouringService.getInstance().updateTourById(request.params.id, request.body);
            response.status(200).send({
                tour: tour.get(),
                route: await tour.getGeoLogs(),
            });
        }
    });
    
    
    server.route<{Body: ITour}>({
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
        handler: async function (request, response) {
            const tour = await TouringService.getInstance().createTour(request.body);
            response.status(200).send({
                tour: tour.get(),
                route: await tour.getGeoLogs(),
            });
        }
    });
}