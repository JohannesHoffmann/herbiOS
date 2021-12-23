import Fastify, { FastifyInstance } from 'fastify';
import FastifyCors from "fastify-cors";
import FastifyJwt from "fastify-jwt";

import AudioService from './audio/AudioService';
import ConfigService from './ConfigService';
import GeoService from './geo/GeoService';
import ClimateService from './climate/ClimateService';
import LightsService from './lights/LightsService';
import AppService from './app/AppService';
import NetworkingService from './networking/NetworkingService';
import registerTouringEndpoints from './touring/TouringRestApi';
import registerPoiEndpoints from './poi/PoisRestApi';

class RestService {

    private static instance: RestService;

    public static getInstance(): RestService {
        if (!RestService.instance) {
            RestService.instance = new RestService();
        }
        return RestService.instance;
    }

    server: FastifyInstance;
    port: number;
    
   private constructor() {
        this.port = ConfigService.getInstance().getConfig().rest.port;
        
        this.server = Fastify({
            logger: false
        });
        this.server.register(FastifyCors);

        this.server.register(FastifyJwt, {
            secret: ConfigService.getInstance().getConfig().authentication.secret,
            sign: {
                expiresIn: ConfigService.getInstance().getConfig().authentication.expiration,
            },
        });
    
        this.server.addHook("onRequest", async (request, reply) => {
            
            const noAuthenticationList: Array<string | RegExp> = [
                /^\/assets/,
                "/login",
                "/heartbeat",
            ];
            
            for (const matcher of noAuthenticationList) {
                if (request?.routerPath && request.routerPath.match(matcher)) {
                    return;
                }
            }
    
            try {
                await request.jwtVerify();
            } catch (err) {
              reply.send(err);
            }
          });

        this.routes();
    }

    public getServer() {
        return this.server.server;
    }

    routes() {

        registerTouringEndpoints(this.server);
        registerPoiEndpoints(this.server);

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
            handler: async function (request, reply) {
                const body = request.body as {email: string, password: string};
                    // Display at the van
                    console.log(request.url);
                    // Owner Katha
                    if (body.password === "EE9h9aMfuB5mx9B5A4HyuBEyLlEv84LH") {
                        const token = this.jwt.sign({type: "owner", name: "Katha"});
                        reply.status(200).send({token});
                        return;
                    }

                    // Owner Herbi
                    if (body.password === "hMA3x994QvC46YZKnlBnnhZy4QAsQJus") {
                        const token = this.jwt.sign({type: "owner", name: "Herb"});
                        reply.status(200).send({token});
                        return;
                    }

                    // Guests
                    if (body.password === "vzyMdKemBm0UJordQIW5LlF6lbQ7K6nY") {
                        const token = this.jwt.sign({type: "guest", name: "Gast"});
                        reply.status(200).send({token});
                        return;
                    }
                    
    
                    reply.status(401).send({});
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
            const params = request.params as {strength: number}
            AudioService.getInstance().setVolume(params.strength);
            response.status(200).send({volume: params.strength})
        });


        // Playback
        this.server.get("/audio/play/:playerName", async function (request, response) {
            const params = request.params as {playerName: string}
            try {
                await AudioService.getInstance().startPlayback(params.playerName);
                response.status(200).send(AudioService.getInstance().getPlayback());
            } catch (e) {
                console.log(e);
                response.status(404).send({error: e.message});
            }
        });
        this.server.get("/audio/playing", async function (request, response) {
            response.status(200).send(AudioService.getInstance().getPlayback());
        });
        this.server.get("/audio/play", async function (request, response) {
            await AudioService.getInstance().play();
            response.status(200).send(AudioService.getInstance().getPlayback());
        });
        
        this.server.get("/audio/stop", async function (request, response) {
            await AudioService.getInstance().stop();
            response.status(200).send(AudioService.getInstance().getPlayback());
        });

        // GEO LOCATION
        this.server.get("/geo/position", async function (request, response) {
            const geo = await GeoService.getInstance().getGeo();
            response.status(200).send(geo);
        });


        // HEATER
        // this.server.get("/heater", async function (request, response) {
        //     response.status(200).send(ClimateService.getInstance().getHeater());
        // });

        // HEARTBEAT
        this.server.get("/heartbeat", async function (request, response) {
            response.status(200).send(true);
        });

        // MODE
        this.server.post("/mode", async function (request, response) {
            AppService.getInstance().setVehicleMode("tour");
            response.status(200).send(true);
        });
    }

    start() {
        this.server.listen(this.port, '0.0.0.0', (err, address) => {
            if (err) throw err
            console.log(`server listening on ${address}`);
        });
    }

}

export default RestService;