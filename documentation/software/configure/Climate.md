# Climate

You can add unlimited heaters to the ui. The UI currently supports automatic and manual modes. The automatic sets the temperature to reach and the system tries to keep the set temperature. The manual mode sets the heater strength and no automation intersects. 

## Configuration

This section shows two ways to configure a heater. To add a Fan to the heater's panel add a fan configuration with the **unique_id: "overhead** described in [how to configure a Fan](./Fans)

### Auto-Discovery

You can send the configuration of a heater directly via MQTT via a tool of your choice. Send the below JSON to the topic **herbiOs/climates/<unique_id>/config**. Set the retained flat to true to get the config on ui reload instantly. Replace _<unique_id>_ with the unique_id of the json.

Example configuration:

```json
{
    "name": "Heater",
    "unique_id": "heater",
    "modes": ["off", "heat", "fan_only"],
    "preset_modes": ["manual", "automatic"],
    "fan_modes": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    "temperature_initial": 21
}
```

No reload is required. The new heater should appear in the control of the frontend.


### Manual

Edit the **api/data/config.json** file to add a heater manually. Add the following part to the json file. Extend it to your needs.

```json
"climates": [
    {
        "name": "Heater",
        "unique_id": "heater",
        "modes": ["off", "heat", "fan_only"],
        "preset_modes": ["manual", "automatic"],
        "fan_modes": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        "temperature_initial": 21
    }
]
```

Reload the api by stop the current process and run `npm start` again. A heater should appear on the frontend.

## Data

### Configuration Data

```Typescript
{
    "name":  string
    "unique_id": string,
    "modes": Array<string>,
    "preset_modes": Array<string>,
    "fan_modes": Array<string>,
    "temperature_initial": number,

    "mode_command_topic"?: string;
    "mode_state_topic"?: string;
    "preset_mode_command_topic"?: string;
    "preset_mode_state_topic"?: string;
    "fan_mode_state_topic"?: string;
    "fan_mode_command_topic"?: string;
    "temperature_command_topic"?: string;
    "temperature_state_topic"?: string;
    "temperature_current_topic"?: string;
}
```

Properties with a ? are optional

### Topics

When no custom topics are configured the ui uses the following topics:

| Topic   |      Values      |  Description |
|----------|:-------------|:------|
| herbiOs/climates/<unique_id>/mode/set |  String (value of the configured json) | Request to change the heater mode |
| herbiOs/climates/<unique_id>/mode/state |  String (value of the configured json) | The actual mode of  the heater |
| herbiOs/climates/<unique_id>/preset/set |  String (value of the configured json) | Request to change the preset mode|
| herbiOs/climates/<unique_id>/preset/state |  String (value of the configured json) | The actual preset of  the heater |
| herbiOs/climates/<unique_id>/fanMode/set |  String (value of the configured json) | Request to change the fanMode |
| herbiOs/climates/<unique_id>/fanMode/state |  String (value of the configured json) | The actual fanMode of  the heater |
| herbiOs/climates/<unique_id>/targetTemp/set |  Number | Request to change the targeted temperature |
| herbiOs/climates/<unique_id>/targetTemp/state |  Number| The actual targeted temperature |
| herbiOs/climates/<unique_id>/currentTemp/state |  Number| The actual measured temperature from a sensor |