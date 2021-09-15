import { Marker, Popup, useMap } from "react-leaflet";
import React from "react";
import { Icon } from "leaflet";
import Config from "../../Config";
import { useGeoState } from "../GeoContext";

const VanMarker = (props: {lat: number; lon: number;}) => {
    const {lat, lon} = props;
    const map = useMap();

    React.useEffect(() => {
        map.setView([lat, lon], map.getZoom());
    }, [lat, lon, map]);

    const vanMarker= new Icon({
        iconUrl: Config.host + "/assets/vanMarker.png",
        iconSize: [68 / 1.2, 78 / 1.2]
      });

    return <Marker position={[lat, lon]} icon={vanMarker}>
    <Popup>
       Hier stehe ich gerade! {lat} {lon}
    </Popup>
  </Marker>

}

export default function MapLayerCurrentPosition() {
    const { lat, lon } = useGeoState().current;

    return <VanMarker lat={lat} lon={lon} />
}