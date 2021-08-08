import Fastify, { FastifyInstance } from 'fastify';
import FastifyCors from "fastify-cors";
import FastifyJwt from "fastify-jwt";
import ConfigService from './ConfigService';
import TelemetryService from './telemetry/TelementryService';
import { ITelemetry } from './telemetry/TelemetryDao';

declare module 'fastify' {
    interface FastifyRequest {
      User: {type: string; name: string; iat: number, exp: number}
    }
  }

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

    routes() {

        // ASSETS
        this.server.register(require('fastify-static'), {
            root: __dirname + "/../assets",
            prefix: '/assets/',
            list: true
        });

          // TELEMETRY ENDPOINT
          this.server.route({
            method: 'POST',
            url: '/telemetry',
            schema: {
                body: {
                    position: {
                        status: { type: 'number', require: true },
                        dateTime: { type: 'string', require: true },
                        lat: { type: 'number', require: true },
                        lon: { type: 'number', require: true },
                        headingDeviation: { type: 'string' },
                        speed: { type: 'number' },
                        altitude: { type: 'number' },
                        satellites: { type: 'number' },
                    },
                },
                response: 200,
            },
            handler: async function (request, reply) {
                console.log("REQUEST FROM", request.ip);
                if (request.user["type"] === "van") {
                    const payload = request.body as Omit<ITelemetry, "dateTime">;
                    if (payload.position.lat !== 0 && payload.position.lon !== 0) {
                        TelemetryService.getInstance().setTelemetry(payload);
                    }
                }
                reply.status(200).send(request.body);
            }
        });


        // TELEMETRY FETCH
        this.server.get("/telemetry", async function (request, response) {
            const data = TelemetryService.getInstance().getTelemetry();
            response.status(200).send(data);
        });


        // Heartbeat
        this.server.get("/heartbeat", async function (request, response) {
            response.status(200).send({ok: true});
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