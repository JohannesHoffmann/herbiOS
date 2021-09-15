import { IGeo } from "../geo/IGeo";

export interface ITour {
    id: number;
    name: string;
    startTime: Date;
    endTime?: Date;
    description?: string;
}

export interface ITourPackage {
    tour: ITour,
    route: Array<IGeo>;
}
