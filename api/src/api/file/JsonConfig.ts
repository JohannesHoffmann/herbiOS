import * as Path from 'path';
import * as Fs from 'fs';


export default abstract class JsonConfig<T> {

    private path;
    protected _content: T;

    constructor(path: string) {
        this.path = Path.join(__dirname, `../../../data`, path);
    }

    public load() {
        if (Fs.existsSync(this.path)) {
            const loadedConfig = Fs.readFileSync(this.path, {encoding: "utf-8"});
            this._content = {
                ...this._content, 
                ...JSON.parse(loadedConfig),
            };
        }
    }

    public save(): this {
        Fs.writeFileSync(this.path, JSON.stringify(this._content, null, 4));
        return this;
    }

    public set(data: Partial<T>): this {
        this._content = {
            ...this._content,
            ...data,
        }
        return this;
    }

    public get(): T {
        return this._content;
    }

}