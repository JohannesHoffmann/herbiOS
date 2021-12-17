import React from "react";
import { Box,  Flex, Heading, Text } from "rebass";
import { IPoi, IPoiInput } from "./IPoi";
import {format}  from "date-fns";
import { de } from 'date-fns/locale'
import { useUserState } from "../../contexts/UserContext";
import Axios from "axios";
import Config from "../../Config";
import SingleLineEdit from "../../ui/form/SingleLineEdit";
import MultiLineEdit from "../../ui/form/MultiLineEdit";
import IconCalendar from "../../ui/icons/IconCalendar";
import { MapContainer } from "react-leaflet";
import TilesVector from "../../geo/map/TilesVector";
import MapLayerPois from "./MapLayerPois";
import PoiIcon from "./PoiIcon";

type Props = {
    poiId?: number;
    onPoiClose?: () => void;
}

export default function PoiForm(props: Props) {
    const { poiId } = props;
    const [poi, setPoi] = React.useState<IPoi>();
    const loaded = React.useRef(false);
    const {authToken} = useUserState();

    React.useEffect(() => {
        const source = Axios.CancelToken.source();

        const refresh = async () => {
            loaded.current = true;
            try {
                const data = await Axios.get<IPoi>(Config.host+ "/poi/" + poiId, {headers: {Authorization: "Bearer " + authToken}, cancelToken: source.token});
                if (data.data) {
                    setPoi(data.data);
                }
            } catch (e) {
                console.log("Error loading Poi", e);
            }
        }

        if (!loaded.current && poiId !== undefined) {
            refresh();
        }

        return () => {
            source.cancel();
        }
    }, [poiId, authToken]);

    const changePoi = async (poiUpdate: Partial<IPoiInput>) => {
        if (!poiId) {
            return;
        }

        try {
            await Axios.put<Partial<IPoiInput>>(
                Config.host+ "/poi/" + poiId, 
                poiUpdate,
                {headers: {Authorization: "Bearer " + authToken}}
            );
        } catch (e) {
            console.log("Error updating Poi", e);
        }
    }

    return <>
        <Box mb={4}>

        {poi && poi.name && poi.typeId && <Flex alignItems="center" mb={3}>
                <Box mr={3}>
                    <PoiIcon typeId={poi.typeId} color="primary" secondary="darkGrey" height={30} />
                </Box>
                <Box flexGrow={1}>
                    <SingleLineEdit
                        value={poi.name}
                        Wrapper={<Heading fontSize={5} mb={0} />}
                        onChange={(name: string) => changePoi({name})}
                    />
                </Box>
            </Flex>}



            <Flex mb={3}>
                <Box mr={2}>
                    <IconCalendar color="primary" width={18} />
                </Box>
                <Box flexGrow={1}>
                    {poi && poi.createdAt&& <Text>{format(new Date(poi.createdAt), "EEEE, dd. MMM yyyy", {locale: de})}</Text>}
                </Box>
            </Flex>

            <Box mt={4}>
                <MultiLineEdit
                    value={poi?.description}
                    addText="POI Beschreibung hinzufügen +"
                    Wrapper={<Text />}
                    onChange={(description: string) => changePoi({description})}
                />
            </Box>

            {poi && <Box
                ml={-3}
                mr={-3}
                mt={3}
                mb={4}
                p={0} 
            >
                <MapContainer style={{height: "100%", minHeight: "300px"}} center={[poi.lat, poi.lon]} zoom={13} scrollWheelZoom={true} maxZoom={18}>
                    <TilesVector />
                    <MapLayerPois pois={[poi]} />
                </MapContainer>
            </Box>}

        </Box>
    </>
}