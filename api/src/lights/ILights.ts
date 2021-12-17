export interface ILightConfiguration {
    name: string;
    brightness: boolean;
    unique_id: string;
    command_topic?: string;
    state_topic?: string;
}