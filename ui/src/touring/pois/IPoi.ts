
export interface IPoi extends IPoiInput {
    id: number;
    createdAt: Date;
    tourId: number;
    lat: number;
    lon: number;
}

export interface IPoiInput {
    name: string;
    typeId: number;
    description?: string;
}
