export interface IGeo {
    status: number,
    dateTime: Date,
    lat: number,
    lon: number,
    headingDeviation: string,
    speed: number,
    altitude: number,
    satellites: number,
}