import React from 'react';
import { MapContainer } from 'react-leaflet';
import TilesVector from '../geo/map/TilesVector';
import { Box, Text } from 'rebass';
import { useGeoState } from '../geo/GeoContext';
import MapLayerTourRoute from './map/MapLayerTourRoute';
import MapLayerCurrentPosition from '../geo/map/MapLayerCurrentPosition';
import { IGeo } from '../geo/IGeo';
import { IPoi } from './pois/IPoi';
import MapLayerPois from './pois/MapLayerPois';
import PoiForm from './pois/PoiForm';
import Modal from '../ui/modal/Modal';
import Slider from '../ui/slider/Slider';

export type TourMapProps = {
    route?: Array<IGeo>;
    pois?: Array<IPoi>;
    showCurrentPosition?: boolean;
    variant?: "modal" | "slider"
}

export default function TourMap (props: TourMapProps) {
    const { route, showCurrentPosition, pois } = props;
    const { lat, lon } = useGeoState().current;
    const [editId, setEditId] = React.useState<number>();
    const variant = props.variant ? props.variant : "modal";

    return <>
        <Box mt={3} width="100%" sx={{position: "relative"}}>
            <Box
                ml={-3}
                mr={-3}
                mt={3}
                mb={4}
                p={0} 
                sx={{
                }}
            >
                <MapContainer style={{height: "100%", minHeight: "300px"}} center={[lat, lon]} zoom={10} scrollWheelZoom={true} maxZoom={18}>
                    <TilesVector />
                    {showCurrentPosition && <MapLayerCurrentPosition />}
                    {route && <MapLayerTourRoute route={route} />}
                    {pois && <MapLayerPois pois={pois} onMarkerSelect={(id) => setEditId(id)} />}
                </MapContainer>
            </Box>
        </Box>

        {variant === "modal" && <Modal
            subModal={true}
            open={editId ? true : false}
            onClose={() => setEditId(undefined)}
            header={<Text alignSelf="center" mb={2} textAlign="center">
                Poi bearbeiten
            </Text>}
        >
            <PoiForm poiId={editId} />
        </Modal>}

        {variant === "slider" && <Slider
            label="Poi bearbeiten"
            subSlider={true}
            open={editId ? true : false}
            onClose={() => setEditId(undefined)}
        >
            <PoiForm poiId={editId} />
        </Slider>}
    </>
    
}