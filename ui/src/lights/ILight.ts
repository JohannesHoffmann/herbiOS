
export interface ILightState {
    name: string;
    unique_id: string;
    brightness: number;
    command_topic?: string;
    state_topic?: string;
}

export interface ILightConfiguration {
    name: string;
    brightness: boolean;
    unique_id: string;
    command_topic?: string;
    state_topic?: string;
}