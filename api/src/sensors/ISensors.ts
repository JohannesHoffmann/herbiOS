export interface ISensorConfiguration {
    name: string;
    unique_id: string;
    state_topic?: string;
    icon?: "thermometer" | "battery";
    unit_of_measurement?: string;
}

export interface ISensorData extends Omit<ISensorConfiguration, "state_topic"> {
    value: string | number | boolean;
    changedAt: Date;
}