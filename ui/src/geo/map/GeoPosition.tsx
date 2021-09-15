import React from 'react';
import { MapContainer} from 'react-leaflet';
import TilesVector from './TilesVector';
import { useGeoState } from '../GeoContext';
import { Box, Heading } from 'rebass';
import PoiList from '../../touring/pois/PoiList';
import MapLayerCurrentPosition from './MapLayerCurrentPosition';

export default function GeoPosition () {
    const { lat, lon } = useGeoState().current;

    return <>
        <Heading>Position</Heading>
        <Box mt={3} width="100%">
            <PoiList />
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
                    <MapLayerCurrentPosition />
                </MapContainer>
            </Box>
        </Box>
    </>
    
}