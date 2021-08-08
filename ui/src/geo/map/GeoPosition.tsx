import React from 'react';
import { MapContainer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from "leaflet";
import Config from '../../Config';
import TilesVector from './TilesVector';
import { useGeoState } from '../GeoContext';

const VanMarker = (props: {lat: number; lon: number;}) => {
    const {lat, lon} = props;
    const map = useMap();

    React.useEffect(() => {
        map.setView([lat, lon], map.getZoom());
    }, [lat, lon, map]);

    const vanMarker= new Icon({
        iconUrl: Config.host + "/assets/vanMarker.png",
        iconSize: [50, 29]
      });

    return <Marker position={[lat, lon]} icon={vanMarker}>
    <Popup>
       Hier stehe ich gerade! {lat} {lon}
    </Popup>
  </Marker>

}

export default function GeoPosition () {
    const { lat, lon } = useGeoState().current;

    return <MapContainer style={{height: "100%", minHeight: "200px"}} center={[lat, lon]} zoom={13} scrollWheelZoom={true}>
        <TilesVector />
        <VanMarker lat={lat} lon={lon} />
  </MapContainer>
}