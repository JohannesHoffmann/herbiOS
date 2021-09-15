import React from 'react';
import { MapContainer } from 'react-leaflet';
import TilesVector from '../geo/map/TilesVector';
import { Box } from 'rebass';
import { useGeoState } from '../geo/GeoContext';
import MapLayerTourRoute from './map/MapLayerTourRoute';
import MapLayerCurrentPosition from '../geo/map/MapLayerCurrentPosition';
import { IGeo } from '../geo/IGeo';

export type TourMapProps = {
    route?: Array<IGeo>;
    showCurrentPosition?: boolean;
}

export default function TourMap (props: TourMapProps) {
    const { route, showCurrentPosition } = props;
    const { lat, lon } = useGeoState().current;

    return <>
        <Box mt={3} width="100%">
            <Box
                ml={-3}
                mr={-3}
                mt={3}
                mb={4}
                p={0} 
                sx={{
                }}
            >
                <MapContainer style={{height: "100%", minHeight: "300px"}} center={[lat, lon]} zoom={10} scrollWheelZoom={true}>
                    <TilesVector />
                    {showCurrentPosition && <MapLayerCurrentPosition />}
                    {route && <MapLayerTourRoute route={route} />}
                </MapContainer>
            </Box>
        </Box>
    </>
    
}