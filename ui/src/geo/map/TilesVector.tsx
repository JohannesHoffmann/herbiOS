import React from "react";
import "mapbox-gl-leaflet";
import { useMap } from 'react-leaflet';
import L from "leaflet";
import { useEffect } from "react";
import Config from "../../Config";

export default React.memo(function TilesVector() {

    const map = useMap();

    const vectorGrid = L.mapboxGL({accessToken: "pk.eyJ1Ijoiam9laG9wcGUiLCJhIjoiY2t4ZzZuZDlnMDFzMTJwbHRvdWN0b3MyMiJ9.qKBK3l2eTlgLKTC32q0suw", style: Config.tileServer + '/styles/basic-preview/style.json'});

    useEffect(() => {
        map.addLayer(vectorGrid);
    });

    return null;
});