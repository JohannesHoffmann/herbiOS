export interface IClimateConfiguration {
    name: string;
    unique_id: string;
    
    modes?: Array<string>;
    mode_command_topic?: string;
    mode_state_topic?: string;

    preset_modes?: Array<string>;
    preset_mode_command_topic?: string;
    preset_mode_state_topic?: string;

    fan_modes?: Array<string>;
    fan_mode_state_topic?: string;
    fan_mode_command_topic?: string;

    temperature_initial?: number;
    temperature_command_topic?: string;
    temperature_state_topic?: string;
    temperature_current_topic?: string;
    
    availability_topic?: string;
}