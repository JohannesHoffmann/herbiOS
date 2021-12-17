export interface ILightConfiguration {
    name: string;
    brightness: boolean;
    unique_id: string;
}

export interface ILightConfigurationManual extends ILightConfiguration{
    command_topic?: string;
    state_topic?: string;
}

export interface ILightConfigurationAuto extends ILightConfiguration{
    command_topic?: string;
    stateTopics?: string;
}