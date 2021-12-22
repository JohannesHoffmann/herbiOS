# Switches

You can add unlimited switches to the ui. The UI currently supports ON and OFF of a switch.

## Configuration

This section shows two ways to configure switches.

### Auto-Discovery

You can send the configuration of a switch directly via MQTT via a tool of your choice. Send the below JSON to the topic **herbiOs/switches/<unique_id>/config**. Set the retained flat to true to get the config on ui reload instantly. Replace _<unique_id>_ with the unique_id of the json.

Example configuration:

```json
{
    "name": "Chiller",
    "unique_id": "chiller"
}
```

No reload is required. The new switch should appear in the control of the frontend.

### Manual

Edit the **api/data/config.json** file to add switches manually. Add the following part to the json file. The example adds two switches. Extend it to your needs.

```json
"switches": [
    {
        "name": "Chiller",
        "unique_id": "chiller"
    },
    {
        "name": "Inverter",
        "unique_id": "inverter"
    }
]
```

Reload the api by stop the current process and run `npm start` again. The switches should appear on the frontend.

## Data

### Configuration Data

```Typescript
{
    "name":  string
    "unique_id": string,

    "command_topic"?: string;
    "state_topic"?: string;
}
```

Properties with a ? are optional

### Topics

When no custom topics are configured the ui uses the following topics:

| Topic   |      Values      |  Description |
|----------|:-------------|:------|
| herbiOs/switches/<unique_id>/set |  "ON" \| "OFF" | Request to toggle the switch |
| herbiOs/switches/<unique_id>/state |  "ON" \| "OFF" | The actual state of  the switch |