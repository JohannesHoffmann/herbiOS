import SerialPort from 'serialport';
import ConfigService from './ConfigService';
import Readline from  '@serialport/parser-readline';
import MockBinding from '@serialport/binding-mock';

if (ConfigService.getInstance().getConfig().env === "development") {
    SerialPort.Binding = MockBinding
    // Create a port and enable the echo and recording.
    MockBinding.createPort(ConfigService.getInstance().getConfig().serial.path, { echo: true, record: true })
}

const readMock = (command: string): string => {
    if (command === "getPosition") {
        return "3,		2021-02-26 21:02:28.000,	483582775,	108990267,	,		218,	44820,	4,		1481,	0,		66063,";
    }
    return "";
}

class SerialService {

    path: string;
    baud: number;

    port: SerialPort;
    parser: Readline;

    private _coolDown: number = 350;
    private _cooling: boolean = false;
    private _lastCommand: string;

    constructor() {
        this.path = ConfigService.getInstance().getConfig().serial.path;
        this.baud = ConfigService.getInstance().getConfig().serial.baud;
        this.port = new SerialPort(this.path, { baudRate: this.baud });
        this.parser = this.port.pipe(new Readline({ delimiter: '\n' }));

        this.port.on('error', function(err) {
            console.log('Error: ', err.message)
          });
    }

    public async send(command: string) {
        if (!this._cooling) {
            this._cooling = true;
            this._lastCommand = "";
            this._write(command);

            setTimeout(() => {
                this._cooling = false;

                if (this._lastCommand) {
                    this.send(this._lastCommand);
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
                console.log("Wrote: ", command);
                resolve();
            });
        })
        
    }

    public async sendAndRead(command: string): Promise<string> {
        const port = this.parser;

        await this._write(command);

        return new Promise((resolve, reject) => {
            if (ConfigService.getInstance().getConfig().env === "development") {
                resolve(readMock(command));
            }

            function dataRead (data) {
                port.removeListener("data", dataRead);
                console.log("Read", data.toString());
                resolve(data.toString());
            }
            port.addListener("data", dataRead);
        });
    }

}

export default new SerialService();