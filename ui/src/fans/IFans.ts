
export interface IFanState {
    name: string;
    unique_id: string;
    state: "ON" | "OFF";
    preset_mode?: string;
    speed?: number;
}

export interface IFanConfiguration {
    name: string;
    unique_id: string;
    command_topic?: string;
    state_topic?: string;

    preset_modes?: Array<string>;
    preset_mode_command_topic?: string;
    preset_mode_state_topic?: string;

    speed?: boolean;
    speed_state_topic?: string;
    speed_command_topic?: string;
}

export enum FanTopics {
    preset = "preset",
    speed = "speed"
}