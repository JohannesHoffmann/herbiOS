import SerialPort from 'serialport';
import ConfigService from './ConfigService';
import Readline from  '@serialport/parser-readline';
import MockBinding from '@serialport/binding-mock';

type CommandSend = {command: string; resolve: (data: string) => void; reject: (data: string) => void; read: boolean};

export enum SerialStuff {
    delimiter = ":::",
}


if (ConfigService.getInstance().getConfig().env === "development") {
    SerialPort.Binding = MockBinding
    // Create a port and enable the echo and recording.
    MockBinding.createPort(ConfigService.getInstance().getConfig().serial.path, { echo: true, record: true })
}

const readMock = (command: string): string => {
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
}



class SerialService {

    private static instance: SerialService;

    public static getInstance(): SerialService {
        if (!SerialService.instance) {
            SerialService.instance = new SerialService();
        }
        return SerialService.instance;
    }

    path: string;
    baud: number;

    port: SerialPort;
    parser: Readline;

    private _coolDown: number = 350;
    private _cooling: boolean = false;
    private _lastCommand: string;
    private _deviceReady: boolean = false;
    private _waitToBeReady: number = 5000;

    private sendPipeline: Array<CommandSend> = [];
    private executing: boolean = false;

    private _messageListener: Array<(message: string) => void> = [];


    private constructor() {
        this.path = ConfigService.getInstance().getConfig().serial.path;
        this.baud = ConfigService.getInstance().getConfig().serial.baud;
        console.log(`Working with Sensorer on ${this.path} with baudrate ${this.baud}`);
        this.port = new SerialPort(this.path, { baudRate: this.baud });
        // this.port.set({dtr: false}); // DTR resets the arduino when serial connection is established. - disable dtr: `stty -F /dev/ttyUSB0 -hupcl`
        this.parser = this.port.pipe(new Readline({ delimiter: '\n' }));

        this.port.on('error', function(err) {
            console.log('Error: ', err.message)
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

        if (ConfigService.getInstance().getConfig().env === "development") {
            this.port.on("open", () => {
                this._development();
            });
        }
    }

    /**
     * Developer Device Simulator
     */
    private _development() {
        setInterval(async () => {

            function delay(delayInms) {
                return new Promise(resolve => {
                  setTimeout(() => {
                    resolve(2);
                  }, delayInms);
                });
              }
            
            // @ts-ignore
            await this.port.binding.emitData(Buffer.from(`geoPosition${SerialStuff.delimiter}${readMock("getPosition")}\n`));

            await delay(1000);

            // @ts-ignore
            await this.port.binding.emitData(`temp${SerialStuff.delimiter}${15 + Math.round(15 * Math.random())}\n`);
            await delay(1000);

            // @ts-ignore
            await this.port.binding.emitData(`sensor${SerialStuff.delimiter}temperature1,${15 + Math.round(15 * Math.random())}\n`);
            await delay(1000);
            // @ts-ignore
            await this.port.binding.emitData(`sensor${SerialStuff.delimiter}temperature2,${15 + Math.round(15 * Math.random())}\n`);
            await delay(1000);

            // @ts-ignore
            await this.port.binding.emitData(`sensor${SerialStuff.delimiter}humidity1,${Math.round(100 * Math.random())}\n`);
            await delay(1000);
            
            // @ts-ignore
            await this.port.binding.emitData(`sensor${SerialStuff.delimiter}battery1,${Math.round(100 * Math.random())}\n`);
            await delay(1000);
        }, 1000 * 60);
    }

    public onMessage(callback: (message: string) => void) {
        this._messageListener.push(callback);
    }

    public offMessage(callback: (message: string) => void) {
        this._messageListener = this._messageListener.filter(cb => cb !== callback);
    }

    public async sendFastCommand(command: string) {
        if (!this._cooling) {
            this._cooling = true;
            this._lastCommand = "";
            this.send(command, false);

            setTimeout(() => {
                this._cooling = false;

                if (this._lastCommand) {
                    this.sendFastCommand(this._lastCommand);
                }
            }, this._coolDown)
        } else {
            this._lastCommand = command;
        }
    }

    private async _write(command: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.port.write(command + '\n', function(err) {
                if (err) {
                    console.log('Error on write: ', err.message)
                    reject(err);
                }
                console.log("Serial: ", command);
                resolve();
            });
        })
        
    }



    public async send(command: string, read: boolean = true): Promise<string> {
        let tmpResolve;
        let tmpReject;
        const promise = new Promise<string>((resolve, reject) => {
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
    }


    private _executor = async () => {
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
            await this._write(com.command);
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
    }


}

export default SerialService;