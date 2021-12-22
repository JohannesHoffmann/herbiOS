export interface ISensorConfiguration {
    name: string;
    unique_id: string;
    state_topic?: string;
    icon?: "thermometer" | "battery";
    unit_of_measurement?: string;
}