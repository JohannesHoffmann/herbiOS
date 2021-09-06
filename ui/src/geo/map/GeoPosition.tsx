import React from 'react';
import { MapContainer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from "leaflet";
import Config from '../../Config';
import TilesVector from './TilesVector';
import { useGeoState } from '../GeoContext';
import { Box, Flex, Heading, Text } from 'rebass';
import IconOvernight from '../../ui/icons/IconOvernight';
import IconParking from '../../ui/icons/IconParking';
import IconWorking from '../../ui/icons/IconWorking';
import IconHiking from '../../ui/icons/IconHiking';
import IconSightSeeing from '../../ui/icons/IconSightSeeing';

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

export default function GeoPosition () {
    const { lat, lon } = useGeoState().current;

    return <>
        <Heading>Position</Heading>
        <Box mt={3} width="100%">
            <Flex justifyContent="space-between">
                <Flex alignItems="center">
                    <IconOvernight color="primary" secondary="grey" width={35} /> <Text ml={2} fontSize={[3]}>0</Text>
                </Flex>
                <Flex alignItems="center">
                    <IconParking color="primary" width={35} /> <Text ml={2} fontSize={[3]}>0</Text>
                </Flex>
                <Flex alignItems="center">
                    <IconWorking width={35} /> <Text ml={2} fontSize={[3]}>0</Text>
                </Flex>
                <Flex alignItems="center">
                    <IconHiking color="primary" width={35} /> <Text ml={2} fontSize={[3]}>0</Text>
                </Flex>
                <Flex alignItems="center">
                    <IconSightSeeing color="primary" width={35} /> <Text ml={2} fontSize={[3]}>0</Text>
                </Flex>
            </Flex>
            <Box
                mt={3}
                p={0} 
                sx={{
                    width: [ "100%", "100%"], 
                    borderRadius: 20, 
                    overflow: "hidden", "-webkit-mask-image": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC);"     
                }}
            >
                <MapContainer style={{height: "100%", minHeight: "300px"}} center={[lat, lon]} zoom={13} scrollWheelZoom={true}>
                    <TilesVector />
                    <VanMarker lat={lat} lon={lon} />
                </MapContainer>
            </Box>
        </Box>
    </>
    
}