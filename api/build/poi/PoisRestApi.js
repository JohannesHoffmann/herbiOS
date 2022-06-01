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
const PoiService_1 = __importDefault(require("./PoiService"));
function registerPoiEndpoints(server) {
    server.get("/pois", function (request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const pois = yield PoiService_1.default.getInstance().getPois();
            response.status(200).send(pois);
        });
    });
    server.route({
        method: 'GET',
        url: '/poi/:id',
        schema: {
            params: {
                id: { type: 'number' },
            },
            response: 200,
        },
        handler: function (request, response) {
            return __awaiter(this, void 0, void 0, function* () {
                const poi = yield PoiService_1.default.getInstance().getPoiById(request.params.id);
                response.status(200).send(poi);
            });
        }
    });
    server.route({
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
        handler: function (request, response) {
            return __awaiter(this, void 0, void 0, function* () {
                const poi = yield PoiService_1.default.getInstance().updatePoiById(request.params.id, request.body);
                response.status(200).send(poi);
            });
        }
    });
    server.route({
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
        handler: function (request, response) {
            return __awaiter(this, void 0, void 0, function* () {
                const poi = yield PoiService_1.default.getInstance().createPoi(request.body);
                response.status(200).send(poi);
            });
        }
    });
}
exports.default = registerPoiEndpoints;
//# sourceMappingURL=PoisRestApi.js.map