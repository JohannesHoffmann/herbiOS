import React from 'react';
import { MapContainer} from 'react-leaflet';
import TilesVector from './TilesVector';
import { useGeoState } from '../GeoContext';
import { Box, Heading, Text } from 'rebass';
import PoiList from '../../touring/pois/PoiList';
import MapLayerCurrentPosition from './MapLayerCurrentPosition';
import { IPoi } from '../../touring/pois/IPoi';
import { useUserState } from '../../contexts/UserContext';
import Axios from "axios";
import Config from '../../Config';
import MapLayerPois from '../../touring/pois/MapLayerPois';
import Modal from '../../ui/modal/Modal';
import PoiForm from '../../touring/pois/PoiForm';

export default function GeoPosition () {
    const { lat, lon } = useGeoState().current;
    const [pois, setPois] = React.useState<Array<IPoi>>([]);
    const loaded = React.useRef(false);
    const {authToken} = useUserState();
    const [editId, setEditId] = React.useState<number>();

    React.useEffect(() => {
        const source = Axios.CancelToken.source();

        const refresh = async () => {
            loaded.current = true;
            try {
                const data = await Axios.get<Array<IPoi>>(Config.host+ "/pois", {headers: {Authorization: "Bearer " + authToken}, cancelToken: source.token});
                if (data.data) {
                    setPois(data.data);
                }
            } catch (e) {
                console.log("Error loading tour", e);
            }
        }

        if (!loaded.current) {
            refresh();
        }

        return () => {
            source.cancel();
        }
    }, [authToken]);

    const createPoi = async (typeId: number) => {
        try {
            const newPoi = {
                name: "My Poi",
                typeId,
            };

            const data = await Axios.post<IPoi>(
                Config.host+ "/poi", 
                newPoi, 
                {headers: {Authorization: "Bearer " + authToken}});
                if (data.data) {
                    const poiToAdd: IPoi = data.data;
                    setPois([
                        ...pois,
                        poiToAdd,
                    ]);
                }
        } catch (e) {
            console.log("Error creating a new Poi", e);
        }
    }

    return <>
        <Heading>Position</Heading>
        <Box mt={3} width="100%">
            <PoiList pois={pois} onClick={createPoi} />
            <Box
                mt={3}
                p={0} 
                sx={{
                    width: [ "100%", "100%"], 
                    borderRadius: 20, 
                    overflow: "hidden", "-webkit-mask-image": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC);"     
                }}
            >
                <MapContainer style={{height: "100%", minHeight: "300px"}} center={[lat, lon]} zoom={13} scrollWheelZoom={true} maxZoom={18}>
                    <TilesVector />
                    <MapLayerCurrentPosition />
                    <MapLayerPois pois={pois} onMarkerSelect={(id) => setEditId(id)}  />
                </MapContainer>
            </Box>
        </Box>

        <Modal
            open={editId ? true : false}
            onClose={() => setEditId(undefined)}
            header={<Text alignSelf="center" mb={2} textAlign="center">
                Poi bearbeiten
            </Text>}
        >
            <PoiForm poiId={editId} />
        </Modal>
    </>
    
}