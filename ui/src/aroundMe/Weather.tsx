import React from 'react';
import { Box, Text } from 'rebass';
import { useAroundMeState } from './AroundMeContext';

export default function Weather () {
    const {currentWeather} = useAroundMeState();

    return <Box 
        p={3}
        fontSize={4}
        color="white"
        variant="tile"
        bg="grey"
    >
        {currentWeather && currentWeather.weather && <>
            <img src={"https://openweathermap.org/img/wn/" + currentWeather.weather[0].icon + "@2x.png"} alt="weather" />
            <Text fontSize={[3, 4, 5]} fontWeight="bold" color="white">
                {currentWeather.weather[0].description}
            </Text>
            <Text fontSize={[3, 4, 5]}  color="white">
                {Math.round(currentWeather.main.temp)}°C in {currentWeather.name}
            </Text>
            
        </>}

        {!currentWeather && <Text>Keine Wetterdaten verfügbar.</Text>}
    </Box>
}