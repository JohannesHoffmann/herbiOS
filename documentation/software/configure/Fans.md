# Fans

You can add unlimited fans to the ui. The UI currently supports ON and OFF, different custom presets like "Blow In", "Blow Out", "Blow In & Out" as well the fan speed.

## Configuration

This section shows two ways to configure fans.

### Auto-Discovery

You can send the configuration of a fan directly via MQTT via a tool of your choice. Send the below JSON to the topic **herbiOs/fans/<unique_id>/config**. Set the retained flat to true to get the config on ui reload instantly. Replace _<unique_id>_ with the unique_id of the json.

Example configuration:

```json
{
    "name": "Cabin",
    "unique_id": "cabin",
    "preset_modes": ["in", "out", "inOut"],
    "speed": true
}
```

No reload is required. The new fan should appear in the control of the frontend. Be aware that the Fans Control Panel is located in the mobile menu and not accessible on desktop screens for now. The only fan that will be rendered on wide screens is the fan with the **unique_id: "overhead"**.

### Manual

Edit the **api/data/config.json** file to add fans manually. Add the following part to the json file. The example adds two fans. The first supports speed and some preset modes. The second can only be switched on or off. Extend it to your needs.

```json
"fans": [
    {
        "name": "Cabin",
        "unique_id": "cabin",
        "preset_modes": ["in", "out", "inOut"],
        "speed": true
    },
    {
        "name": "Shower",
        "unique_id": "shower"
    },
]
```

Reload the api by stop the current process and run `npm start` again. The fans should appear on the frontend mobile menu.

## Data

### Configuration Data

```Typescript
{
    "name":  string
    "unique_id": string,
    "speed"?: boolean;
    "preset_modes"?: Array<string>;
    
    "command_topic"?: string;
    "state_topic"?: string;

    "preset_mode_command_topic"?: string;
    "preset_mode_state_topic"?: string;

    "speed_state_topic?": string;
    "speed_command_topic"?: string;
}
```

Properties with a ? are optional

### Topics

When no custom topics are configured the ui uses the following topics:

| Topic   |      Values      |  Description |
|----------|:-------------|:------|
| herbiOs/fans/<unique_id>/set |  "ON" \| "OFF" | Request to toggle the fan |
| herbiOs/fans/<unique_id>/state |  "ON" \| "OFF" | The actual state of  the fan |
| herbiOs/fans/<unique_id>/preset/set |  String (value of the configured json) | Request to change the preset mode|
| herbiOs/fans/<unique_id>/preset/state |  String (value of the configured json) | The actual preset of  the heater |
| herbiOs/fans/<unique_id>/speed/set |  Number 0 to 100 | Request to change the fans speed in % |
| herbiOs/fans/<unique_id>/speed/state |  Number 0 to 100 | The actual speed of  the fan in % |