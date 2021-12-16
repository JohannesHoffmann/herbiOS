export interface ILightConfiguration {
    name: string;
    brightness: boolean;
    unique_id: string;
}

export interface ILightConfigurationManual extends ILightConfiguration{
    setTopics: Array<string>;
    stateTopics: Array<string>;
}

export interface ILightConfigurationAuto extends ILightConfiguration{
    setTopics: Array<string>;
    stateTopics: Array<string>;
}