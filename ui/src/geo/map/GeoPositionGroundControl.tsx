import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import { Icon } from "leaflet";
import Config from '../../Config';
import { Box } from 'rebass';
import { ITelemetry } from '../../views/NotAtTheVan';



const VanMarker = (props: {lat: number; lon: number;}) => {
    const {lat, lon} = props;
    const map = useMap();

    React.useEffect(() => {
        map.setView([lat, lon], map.getZoom());
    }, [lat, lon, map]);

    const vanMarker= new Icon({
        iconUrl: Config.groundControl + "/assets/vanMarker.png",
        iconSize: [50, 29]
      });

    return <Marker position={[lat, lon]} icon={vanMarker}>
    <Popup>
       Hier stehe ich gerade! {lat} {lon}
    </Popup>
  </Marker>

}

type Props = {
    telemetries: Array<ITelemetry>
}

export default function GeoPositionGroundControl (props: Props) {
    const { telemetries } = props;
    const limeOptions = { color: '#FEBF54' }
    const [position, setPosition] = React.useState<[number, number]>();
    const [track, setTrack] = React.useState<Array<[number, number]>>([]);

    React.useEffect(() => {
        if (telemetries.length > 0) {
            setTrack(telemetries.map(items => [items.position.lat, items.position.lon]));
            const lastElement = telemetries[0];
            setPosition([lastElement.position.lat, lastElement.position.lon]);
        }
    }, [setPosition, setTrack, telemetries]);

    return <Box
            mt={3}
            p={0} 
            sx={{
                width: [ "100%", "100%"], 
                borderRadius: 20, 
                overflow: "hidden", 
                "-webkit-mask-image": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC);",    
                position: "relative",
            }}
        >
            <MapContainer style={{height: "70vh"}} center={[48,10]} zoom={15} scrollWheelZoom={true}>
                <TileLayer
                attribution={""}
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Polyline pathOptions={limeOptions} positions={track} />
                {position && <VanMarker lat={position[0]} lon={position[1]} />}
        </MapContainer>
    </Box>
}