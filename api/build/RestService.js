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
const fastify_1 = __importDefault(require("fastify"));
const fastify_cors_1 = __importDefault(require("fastify-cors"));
const fastify_jwt_1 = __importDefault(require("fastify-jwt"));
const AudioService_1 = __importDefault(require("./audio/AudioService"));
const ConfigService_1 = __importDefault(require("./ConfigService"));
const GeoService_1 = __importDefault(require("./geo/GeoService"));
const AppService_1 = __importDefault(require("./app/AppService"));
const TouringRestApi_1 = __importDefault(require("./touring/TouringRestApi"));
const PoisRestApi_1 = __importDefault(require("./poi/PoisRestApi"));
class RestService {
    constructor() {
        this.port = ConfigService_1.default.getInstance().getConfig().rest.port;
        this.server = fastify_1.default({
            logger: false
        });
        this.server.register(fastify_cors_1.default);
        this.server.register(fastify_jwt_1.default, {
            secret: ConfigService_1.default.getInstance().getConfig().authentication.secret,
            sign: {
                expiresIn: ConfigService_1.default.getInstance().getConfig().authentication.expiration,
            },
        });
        this.server.addHook("onRequest", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const noAuthenticationList = [
                /^\/assets/,
                "/login",
                "/heartbeat",
            ];
            for (const matcher of noAuthenticationList) {
                if ((request === null || request === void 0 ? void 0 : request.routerPath) && request.routerPath.match(matcher)) {
                    return;
                }
            }
            try {
                yield request.jwtVerify();
            }
            catch (err) {
                reply.send(err);
            }
        }));
        this.routes();
    }
    static getInstance() {
        if (!RestService.instance) {
            RestService.instance = new RestService();
        }
        return RestService.instance;
    }
    getServer() {
        return this.server.server;
    }
    routes() {
        TouringRestApi_1.default(this.server);
        PoisRestApi_1.default(this.server);
        // ASSETS
        this.server.register(require('fastify-static'), {
            root: __dirname + "/../assets",
            prefix: '/assets/',
            list: true
        });
        // AUTHENTICATION OF CLIENTS
        this.server.route({
            method: 'POST',
            url: '/login',
            schema: {
                body: {
                    password: { type: 'string' }
                },
                response: 200,
            },
            handler: function (request, reply) {
                return __awaiter(this, void 0, void 0, function* () {
                    const body = request.body;
                    // Display at the van
                    console.log(request.url);
                    // Owner Katha
                    if (body.password === "EE9h9aMfuB5mx9B5A4HyuBEyLlEv84LH") {
                        const token = this.jwt.sign({ type: "owner", name: "Katha" });
                        reply.status(200).send({ token });
                        return;
                    }
                    // Owner Herbi
                    if (body.password === "hMA3x994QvC46YZKnlBnnhZy4QAsQJus") {
                        const token = this.jwt.sign({ type: "owner", name: "Herb" });
                        reply.status(200).send({ token });
                        return;
                    }
                    // Guests
                    if (body.password === "vzyMdKemBm0UJordQIW5LlF6lbQ7K6nY") {
                        const token = this.jwt.sign({ type: "guest", name: "Gast" });
                        reply.status(200).send({ token });
                        return;
                    }
                    reply.status(401).send({});
                });
            }
        });
        // LIGHTS
        // this.server.route({
        //     method: 'GET',
        //     url: '/light/:number/:dim',
        //     schema: {
        //         params: {
        //         number: { type: 'number' },
        //         dim: { type: 'integer' }
        //         },
        //         response: 200,
        //     },
        //     handler: async function (request, reply) {
        //         const params = request.params as {number: number, dim: number};
        //         try {
        //             const result = LightsService.getInstance().setLightLevel(params.number, params.dim);
        //             reply.status(200).send(result);
        //         } catch (e) {
        //             reply.status(500).send(e);
        //         }
        //     }
        // });
        // // WIFI
        // this.server.get("/wifi/start", function (req, res) {
        //     NetworkingService.getInstance().wifiOn();
        //     res.status(200).send({ok: true})
        // });
        // this.server.get("/wifi/stop", function (req, res) {
        //     NetworkingService.getInstance().wifiOff();
        //     res.status(200).send({ok: true})
        // });
        // // CELLULAR
        // this.server.get("/cellular/start", async function (request, response) {
        //     const result = await NetworkingService.getInstance().cellularConnect();
        //     response.status(200).send(result);
        // });
        // this.server.get("/cellular/stop", async function (request, response) {
        //     const result = await NetworkingService.getInstance().cellularDisconnect();
        //     response.status(200).send(result);
        // });
        // Volumes
        this.server.get("/audio/volume/:strength", function (request, response) {
            const params = request.params;
            AudioService_1.default.getInstance().setVolume(params.strength);
            response.status(200).send({ volume: params.strength });
        });
        // Playback
        this.server.get("/audio/play/:playerName", function (request, response) {
            return __awaiter(this, void 0, void 0, function* () {
                const params = request.params;
                try {
                    yield AudioService_1.default.getInstance().startPlayback(params.playerName);
                    response.status(200).send(AudioService_1.default.getInstance().getPlayback());
                }
                catch (e) {
                    console.log(e);
                    response.status(404).send({ error: e.message });
                }
            });
        });
        this.server.get("/audio/playing", function (request, response) {
            return __awaiter(this, void 0, void 0, function* () {
                response.status(200).send(AudioService_1.default.getInstance().getPlayback());
            });
        });
        this.server.get("/audio/play", function (request, response) {
            return __awaiter(this, void 0, void 0, function* () {
                yield AudioService_1.default.getInstance().play();
                response.status(200).send(AudioService_1.default.getInstance().getPlayback());
            });
        });
        this.server.get("/audio/stop", function (request, response) {
            return __awaiter(this, void 0, void 0, function* () {
                yield AudioService_1.default.getInstance().stop();
                response.status(200).send(AudioService_1.default.getInstance().getPlayback());
            });
        });
        // GEO LOCATION
        this.server.get("/geo/position", function (request, response) {
            return __awaiter(this, void 0, void 0, function* () {
                const geo = yield GeoService_1.default.getInstance().getGeo();
                response.status(200).send(geo);
            });
        });
        // HEATER
        // this.server.get("/heater", async function (request, response) {
        //     response.status(200).send(ClimateService.getInstance().getHeater());
        // });
        // HEARTBEAT
        this.server.get("/heartbeat", function (request, response) {
            return __awaiter(this, void 0, void 0, function* () {
                response.status(200).send(true);
            });
        });
        // MODE
        this.server.post("/mode", function (request, response) {
            return __awaiter(this, void 0, void 0, function* () {
                AppService_1.default.getInstance().setVehicleMode("tour");
                response.status(200).send(true);
            });
        });
    }
    start() {
        this.server.listen(this.port, '0.0.0.0', (err, address) => {
            if (err)
                throw err;
            console.log(`server listening on ${address}`);
        });
    }
}
exports.default = RestService;
//# sourceMappingURL=RestService.js.map