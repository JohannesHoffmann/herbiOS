# Networking

You can add unlimited interfaces and modems to herbiOS. The UI currently supports ON and OFF as well displaying the signal strength. On Modems the network type like 3G, 4G or 5G will be displayed as well.

Interfaces are any kind of network interfaces on your computer like eth0 or wlan0.

Modems are almost the same but are separate because they where almost every time an external dongle. Each dongle needs different connectivity.

## Configuration

This section shows two ways to configure interfaces or modems.

### Auto-Discovery

You can send the configuration of an interface or modem directly via MQTT via a tool of your choice. Send the below JSON to the topics **herbiOs/networking/interface/<unique_id>/config** for an interface or the topic **herbiOs/networking/modem/<unique_id>/config** or a modem.  Set the retained flat to true to get the config on ui reload instantly. Replace _<unique_id>_ with the unique_id of the json.

Example configuration for a interface:

```json
 {
    "name":  "Wlan",
    "unique_id": "wlan0"
}
```

The unique_id represents the device name on your pc. This can be wlan0 or eth0 or en0 and so on. To switch the device on or off you can install the sensorer/connector

No reload is required. The new interface should appear in the control of the frontend. Be aware that the Interface Control Panel is in the status bar and is only accessible on desktop screens for now.

### Manual

Edit the **api/data/config.json** file to add fans manually. Add the following part to the json file. The example adds two fans. The first supports speed and some preset modes. The second can only be switched on or off. Extend it to your needs.

```json
"networking": {
    "interfaces": [
        {
            "name":  "Wlan",
            "unique_id": "wlan0"
        }
    ],
    "modems": [
        {
            "name": "Cellular",
            "unique_id": "hilink",
            "ip": "192.168.8.1"
        }
    ]
}
```

Reload the api by stop the current process and run `npm start` again. The fans should appear on the frontend mobile menu.

## Data

### Configuration Data

Configuration of an interface

```Typescript
{
    "name":  string
    "unique_id": string,
  
    "command_topic"?: string;
    "state_topic"?: string;

    "signal_strength_state_topic"?: string;
}
```

Configuration of a modem

```Typescript
{
    "name":  string
    "unique_id": string,
  
    "ip": string;
    "command_topic"?: string;
    "state_topic"?: string;

    "signal_strength_state_topic"?: string;
    "network_type_state_topic"?: string;
}
```

Properties with a ? are optional

### Topics

When no custom topics are configured the ui uses the following topics:

| Topic   |      Values      |  Description |
|----------|:-------------|:------|
| herbiOs/networking/interface/<unique_id>/set |  "ON" \| "OFF" | Request to toggle the interface |
| herbiOs/networking/interface/<unique_id>/state |  "ON" \| "OFF" | The actual state of  the interface |
| herbiOs/networking/interface/<unique_id>/signal_strength |  Number | Strength of the current signal|

| herbiOs/networking/modem/<unique_id>/set |  "ON" \| "OFF" | Request to toggle the modem to connect or disconnect |
| herbiOs/networking/modem/<unique_id>/state |  "ON" \| "OFF" | The actual connection state of  the modem |
| herbiOs/networking/modem/<unique_id>/signal_strength |  Number | Strength of the current signal|
| herbiOs/networking/modem/<unique_id>/network_type |  String | Current type of network service e.g. LTE, 4G, 3G, 5G|