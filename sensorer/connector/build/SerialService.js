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
exports.SerialStuff = void 0;
const serialport_1 = __importDefault(require("serialport"));
const ConfigService_1 = __importDefault(require("./ConfigService"));
const parser_readline_1 = __importDefault(require("@serialport/parser-readline"));
const binding_mock_1 = __importDefault(require("@serialport/binding-mock"));
var SerialStuff;
(function (SerialStuff) {
    SerialStuff["delimiter"] = ":::";
})(SerialStuff = exports.SerialStuff || (exports.SerialStuff = {}));
if (ConfigService_1.default.getInstance().getConfig().env === "development") {
    serialport_1.default.Binding = binding_mock_1.default;
    // Create a port and enable the echo and recording.
    binding_mock_1.default.createPort(ConfigService_1.default.getInstance().getConfig().serial.path, { echo: true, record: true });
}
const readMock = (command) => {
    if (command === "getPosition") {
        const positions = [
            `3,		2021-02-26 21:02:28.000,	483582770, 108990260,	,		218,	44820,	4,		1481,	0,		66063,`,
            `3,		2021-02-26 21:02:28.000,	483684420, 108724120,	,		218,	44820,	12,		1481,	0,		66063,`,
            `3,		2021-02-26 21:02:28.000,	483863360, 108806800,	,		218,	44820,	10,		1481,	0,		66063,`,
            `3,		2021-02-26 21:02:28.000,	483876810, 109214500,	,		218,	44820,	9,		1481,	0,		66063,`,
            `3,		2021-02-26 21:02:28.000,	482366220, 109228300,	,		218,	44820,	13,		1481,	0,		66063,`,
            `3,		2021-02-26 21:02:28.000,	482653900, 109398100,	,		218,	44820,	12,		1481,	0,		66063,`,
        ];
        const randIndex = Math.floor(positions.length * Math.random());
        return positions[randIndex];
    }
    return "";
};
class SerialService {
    constructor() {
        this._coolDown = 350;
        this._cooling = false;
        this._deviceReady = false;
        this._waitToBeReady = 5000;
        this.sendPipeline = [];
        this.executing = false;
        this._messageListener = [];
        this._executor = () => __awaiter(this, void 0, void 0, function* () {
            if (!this._deviceReady) {
                this.executing = false;
                return;
            }
            this.executing = true;
            const port = this.parser;
            // get oldest element in pipeline
            const com = this.sendPipeline[0];
            if (com === undefined) {
                this.executing = false;
                return;
            }
            if (com && com.command) {
                yield this._write(com.command);
            }
            // no read then just resolve
            if (com.read === false) {
                com.resolve("");
            }
            // Remove this send command from pipeline
            this.sendPipeline.splice(0, 1);
            // run executor again when other commands still in pipeline
            if (this.sendPipeline.length > 0) {
                this._executor();
                return;
            }
            this.executing = false;
        });
        this.path = ConfigService_1.default.getInstance().getConfig().serial.path;
        this.baud = ConfigService_1.default.getInstance().getConfig().serial.baud;
        console.log(`Working with Sensorer on ${this.path} with baudrate ${this.baud}`);
        this.port = new serialport_1.default(this.path, { baudRate: this.baud });
        // this.port.set({dtr: false}); // DTR resets the arduino when serial connection is established. - disable dtr: `stty -F /dev/ttyUSB0 -hupcl`
        this.parser = this.port.pipe(new parser_readline_1.default({ delimiter: '\n' }));
        this.port.on('error', function (err) {
            console.log('Error: ', err.message);
        });
        setTimeout(() => {
            this._deviceReady = true;
            this._executor();
        }, this._waitToBeReady);
        // Call all registered Listeners on data receive
        this.parser.on('data', (data) => {
            for (const listener of this._messageListener) {
                listener(data);
            }
        });
        if (ConfigService_1.default.getInstance().getConfig().env === "development") {
            this.port.on("open", () => {
                this._development();
            });
        }
    }
    static getInstance() {
        if (!SerialService.instance) {
            SerialService.instance = new SerialService();
        }
        return SerialService.instance;
    }
    /**
     * Developer Device Simulator
     */
    _development() {
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            function delay(delayInms) {
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve(2);
                    }, delayInms);
                });
            }
            // @ts-ignore
            yield this.port.binding.emitData(Buffer.from(`geoPosition${SerialStuff.delimiter}${readMock("getPosition")}\n`));
            yield delay(1000);
            // @ts-ignore
            yield this.port.binding.emitData(`temp${SerialStuff.delimiter}${15 + Math.round(15 * Math.random())}\n`);
            yield delay(1000);
            // @ts-ignore
            yield this.port.binding.emitData(`sensors${SerialStuff.delimiter};temperature1=${15 + Math.round(15 * Math.random())};temperature2=${15 + Math.round(15 * Math.random())};humidity1=${15 + Math.round(15 * Math.random())};motionDetect=${Math.random() > 0.9 ? true : false}\n`);
            yield delay(1000);
        }), 1000 * 60);
    }
    onMessage(callback) {
        this._messageListener.push(callback);
    }
    offMessage(callback) {
        this._messageListener = this._messageListener.filter(cb => cb !== callback);
    }
    sendFastCommand(command) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._cooling) {
                this._cooling = true;
                this._lastCommand = "";
                this.send(command, false);
                setTimeout(() => {
                    this._cooling = false;
                    if (this._lastCommand) {
                        this.sendFastCommand(this._lastCommand);
                    }
                }, this._coolDown);
            }
            else {
                this._lastCommand = command;
            }
        });
    }
    _write(command) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.port.write(command + '\n', function (err) {
                    if (err) {
                        console.log('Error on write: ', err.message);
                        reject(err);
                    }
                    console.log("Serial: ", command);
                    resolve();
                });
            });
        });
    }
    send(command, read = true) {
        return __awaiter(this, void 0, void 0, function* () {
            let tmpResolve;
            let tmpReject;
            const promise = new Promise((resolve, reject) => {
                tmpResolve = resolve;
                tmpReject = reject;
            });
            this.sendPipeline.push({
                command,
                resolve: tmpResolve,
                reject: tmpReject,
                read,
            });
            if (!this.executing) {
                this._executor();
            }
            return promise;
        });
    }
}
exports.default = SerialService;
//# sourceMappingURL=SerialService.js.map