# Sensors

You can add unlimited sensors to the ui. The UI shows the value of the sensor and the unit of measurement. An icon can also be defined.

## Configuration

This section shows two ways to configure sensors.

### Auto-Discovery

You can send the configuration of a sensor directly via MQTT via a tool of your choice. Send the below JSON to the topic **herbiOs/sensors/<unique_id>/config**. Set the retained flat to true to get the config on ui reload instantly. Replace _<unique_id>_ with the unique_id of the json.

Example configuration:

```json
{
    "name": "Cabin Temperature",
    "unique_id": "temperature1",
    "unit_of_measurement": "°C",
    "icon": "thermometer"
}
```

No reload is required. The new sensor should appear in the control of the frontend. Be aware that the Sensors Panel is located in the mobile menu and not accessible on desktop screens for now. The only sensors that will be rendered on wide screens in the top status bar are the sensors with the **unique_id: "temperature1"** or **unique_id: "battery1"**.

### Manual

Edit the **api/data/config.json** file to add sensors manually. Add the following part to the json file. The example adds two sensors. The first supports speed and some preset modes. The second can only be switched on or off. Extend it to your needs.

```json
"sensors": [
    {
        "name": "Cabin Temperature",
        "unique_id": "temperature1",
        "unit_of_measurement": "°C",
        "icon": "thermometer"
    },
    {
        "name": "Cabin Humidity",
        "unique_id": "humidity1",
        "unit_of_measurement": "%"
    }
]
```

Reload the api by stop the current process and run `npm start` again. The sensors should appear on the frontend mobile menu.

## Data

### Configuration Data

```Typescript
{
    "name":  string,
    "unique_id": string,
    "unit_of_measurement"?: string,
    "icon"?: "thermometer" | "battery",
}
```

Properties with a ? are optional

### Topics

When no custom topics are configured the ui uses the following topics:

| Topic   |      Values      |  Description |
|----------|:-------------|:------|
| herbiOs/sensors/<unique_id>/state |  string | The actual measured value of  the sensor |