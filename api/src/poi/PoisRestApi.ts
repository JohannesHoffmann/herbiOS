import { FastifyInstance } from 'fastify';
import { IPoiCreate } from './PoiModel';
import PoiService from './PoiService';

export default function registerPoiEndpoints(server: FastifyInstance) {


    server.get("/pois", async function (request, response) {
        const pois = await PoiService.getInstance().getPois();
        response.status(200).send(pois);
    });

    server.route<{Params: { id: number; }}>({
        method: 'GET',
        url: '/poi/:id',
        schema: {
            params: {
                id: { type: 'number' },
            },
            response: 200,
        },
        handler: async function (request, response) {
            const poi = await PoiService.getInstance().getPoiById(request.params.id);
            response.status(200).send(poi);
        }
    
    });


    server.route<{Params: { id: number; }, Body: Partial<IPoiCreate>}>({
        method: 'PUT',
        url: '/poi/:id',
        schema: {
            params: {
                id: { type: 'number' },
            },
            body: {
                typeId: { type: "number" },
                name: { type: "string" },
                description: { type: "string" },
            },
            response: 200,
        },
        handler: async function (request, response) {
            const poi = await PoiService.getInstance().updatePoiById(request.params.id, request.body);
            response.status(200).send(poi);
        }
    });
    
    
    server.route<{Body: IPoiCreate}>({
        method: 'POST',
        url: '/poi',
        schema: {
            body: {
                typeId: { type: "number" },
                name: { type: "string" },
                description: { type: "string" },
            },
            response: 200,
        },
        handler: async function (request, response) {
            const poi = await PoiService.getInstance().createPoi(request.body);
            response.status(200).send(poi);
        }
    });
}