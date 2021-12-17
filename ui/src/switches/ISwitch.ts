
export interface ISwitchState {
    name: string;
    unique_id: string;
    state: "ON" | "OFF";
    command_topic?: string;
    state_topic?: string;
}

export interface ISwitchConfiguration {
    name: string;
    unique_id: string;
    command_topic?: string;
    state_topic?: string;
}