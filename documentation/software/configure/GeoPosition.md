# Geo Position

To make use of the herbiOs Touring and POI features you have to send the current location of the van to a MQTT Topic. The system then automatically uses the location.

## Configuration

The only way to send the geo information to the application is via MQTT. Send the below JSON to the topic **herbiOs/geoPosition/state**. Set the retained flat to true to get the last location after system restart instantly.

Example configuration:

```json
{
    "name": "Chiller",
    "unique_id": "chiller"
}
```

## Data

### Configuration Data

```Typescript
{
    "status": number, // status: 1 = ?, 2 = ? , 3 = ok
    "dateTime": string, // Date formate: 2021-02-26T21:02:28.000
    "lat": number, // latitude e.g. 48.3582770
    "lon": number, // longitude e.g. 10.8990260
    "headingDeviation": string, // not in use yet
    "speed": number, // not in use yet
    "altitude": number, // in meters
    "satellites": number, // number of available satelites
}
```

If you can feed some data set the properties value to 0 or "" but set all properties!

### Topics

| Topic   |      Values      |  Description |
|----------|:-------------|:------|
| herbiOs/geoPosition/set |  JSON (Schema above) | State of the current geo location |