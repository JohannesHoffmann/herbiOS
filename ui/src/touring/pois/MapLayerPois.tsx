import { Marker, useMap } from "react-leaflet";
import React from "react";
import { Icon } from "leaflet";
import Config from "../../Config";
import { IPoi } from "./IPoi";
import MarkerClusterGroup from 'react-leaflet-cluster';
import IconOvernight from "../../ui/icons/IconOvernight";

type PoiMarkerProps = {
    poi: IPoi;
    onClick?: (id: number) => void; 
}

const PoiMarker = (props: PoiMarkerProps) => {
    const {poi: {lat, lon, id, typeId}, onClick} = props;
    
    const map = useMap();

    React.useEffect(() => {
        map.setView([lat, lon], map.getZoom());
    }, [lat, lon, map]);

    const vanMarker= new Icon({
        iconUrl: Config.host + "/assets/poi" + typeId + ".png",
        iconSize: [68 / 1.2, 78 / 1.2]
      });

    return <Marker 
        position={[lat, lon]} 
        icon={vanMarker}
        eventHandlers={{
            click: (e) => {
              if(onClick) onClick(id);
            },
          }}
    >
        <IconOvernight color="primary" />
  </Marker>

}

type Props = {
    pois: Array<IPoi>;
    onMarkerSelect?: (id: number) => void;
}

export default function MapLayerPois (props: Props) {
    const {pois, onMarkerSelect} = props;


    return <MarkerClusterGroup
            chunkedLoading
        >
        {pois.map((poi) => <PoiMarker key={poi.id} poi={poi} onClick={onMarkerSelect} />)}
    </MarkerClusterGroup>
}