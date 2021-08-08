import React from "react";
import "mapbox-gl-leaflet";
import { useMap } from 'react-leaflet';
import L from "leaflet";
import { useEffect } from "react";
import Config from "../../Config";

export default React.memo(function TilesVector() {

    const map = useMap();

    const vectorGrid = L.mapboxGL({accessToken: "pk.eyJ1Ijoiam9laG9wcGUiLCJhIjoiY2ttbmkyb3kzMHB2NDJ3bHcxbzY2MzV2cSJ9.Ciu9LcNKMQZFiW_PHNIU5w", style: Config.tileServer + '/styles/basic-preview/style.json'});

    useEffect(() => {
        map.addLayer(vectorGrid);
    });

    return null;
});