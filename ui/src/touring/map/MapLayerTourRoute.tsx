import { Polyline } from "react-leaflet";
import React from "react";
import { useTheme } from "emotion-theming";
import { IGeo } from "../../geo/IGeo";

type Props = {
    route: Array<IGeo>;
}

export default function MapLayerTourRoute(props: Props) {
    const {route} = props;
    const theme: any = useTheme();
    const lineOptions = { color: theme.colors.primary };
    
    const track = React.useMemo(() => route.map((point): [number, number] => ([point.lat, point.lon])), [route]);

    return <Polyline pathOptions={lineOptions} positions={track} />
}