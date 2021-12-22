# Lights

How to add Lights to the system. Lights currently supports brightness and on, off.

## Configuration

### Auto-Discovery

You can send the configuration of a light directly via MQTT via a tool of your choice. Send the below JSON to the topic **herbiOs/lights/<unique_id>/config**. Set the retained flat to true to get the config on ui reload instantly. Replace _<unique_id>_ with the unique_id of the json.

Data structure of the configuration:

```json
{
    "name": "Kitchen",
    "unique_id": "kitchen",
    "brightness": true
}
```

No reload is required. The new light should appear in the control of the frontend. Remember to also provide the behavior of putting ~/set changes to ~/state changes.

To set custom topic pathes for set and command, use a configuration like this:

```json
{
    "name": "Kitchen",
    "unique_id": "kitchen",
    "brightness": true,
    "command_topic": "my/light",
    "state_topic": "my/light"
}
```


### Manual

Edit the **api/data/config.json** file to add lights manually. Add the following part to the json file to add two light. The second light has custom topics set for command and state. Extend it to your needs. 

```json
"lights": [
    {
        "name": "Light name",
        "unique_id": "light1",
        "brightness": true
    },
    {
        "name": "Bed",
        "unique_id": "light2",
        "brightness": true,
        "command_topic": "my/light",
        "state_topic": "my/light"
    }
]
```

Reload the api by stop the current process and run `npm start` again. A Light should appear on the frontend. The MQTT listens to **herbiOs/lights/light1/set** and **herbiOs/lights/light1/status** and to **my/light** for the second light.

## Data

### Configuration Data

```Typescript
{
    "name": string,
    "unique_id": string,
    "brightness": boolean,
    "command_topic"?: string,
    "state_topic"?: string,
}
```

Properties with a ? are optional

### Topics

Value schema of both topics:

```typescript
{
    "state": "ON" | "OFF",
    "brightness": number
}
```

| Topic   |      Values      |  Description |
|----------|:-------------|:------|
| herbiOs/lights/<unique_id>/set | JSON (Schema above)  | Request to change the light |
| herbiOs/lights/<unique_id>/state |  JSON (Schema above) | The actual state of the light |
