import React from 'react';
import { Box, Text, Flex, Heading } from 'rebass';
import IconSunrise from '../ui/icons/IconSunrise';
import IconSunset from '../ui/icons/IconSunset';
import { useAroundMeState } from './AroundMeContext';
import { IWeatherCurrent } from './IAroundMe';

export default function Weather () {
    const {currentWeather, forecastWeather} = useAroundMeState();

    if (!currentWeather || !currentWeather.weather) {
        return <Text>Keine Wetterdaten verfügbar.</Text>;
    }

    const sunrise = new Date(currentWeather.sys.sunrise * 1000);
    const sunset = new Date(currentWeather.sys.sunset * 1000);

    return <>
     <Heading>Wetter in {currentWeather.name}</Heading>
        <Box 
            p={3}
            fontSize={4}
        >
            <Box>
                <Flex alignItems="center">
                    <WeatherIcon icon={currentWeather.weather[0].icon} />
                    <Flex alignItems="center">
                        <Text fontSize={[5, 6]} >
                            {Math.round(currentWeather.main.temp)}
                        </Text>
                        <Text fontSize={[1, 1]} ml={3}>
                            °C
                        </Text>
                    </Flex>
                    <Box ml={3}>
                        <Text fontSize={[2]}>
                        Niederschlag: {currentWeather.rain ? currentWeather.rain["1h"] + " mm" : "0 mm"}
                        </Text>
                        <Text fontSize={[2]}>
                        Luftfeuchte: {currentWeather.main.humidity} %
                        </Text>
                        <Text fontSize={[2]}>
                        Wind: {Math.round(currentWeather.wind.speed / 1000 * 3600 * 10) / 10} km/h
                        </Text>
                    </Box>
                </Flex>
                <Flex justifyContent="space-between">
                        <Flex>
                            <IconSunrise color="primary" secondary="grey" />
                            <Text ml={4} fontSize={[3]}>
                                {("0" + sunrise.getHours()).substr(-2)}:{("0" + sunrise.getMinutes()).substr(-2)} Uhr
                            </Text>
                        </Flex>
                        <Flex>
                            <IconSunset color="primary" secondary="grey" />
                            <Text ml={4} fontSize={[3]}>
                                {("0" + sunset.getHours()).substr(-2)}:{("0" + sunset.getMinutes()).substr(-2)} Uhr
                            </Text>
                        </Flex>
                </Flex>
                <Flex mt={4}>
                    {forecastWeather && forecastWeather.list.slice(0, 5).map(forecast => <WeatherForecast key={forecast.dt} weather={forecast} />)}
                </Flex>
                
            </Box>
        </Box>
    </>
}

type WeatherIconProps = {
    icon: string;
    width?: number | string;
}

const WeatherIcon = (props: WeatherIconProps) => {
    const { icon, width } = props;

    return <img src={"https://openweathermap.org/img/wn/" + icon + "@2x.png"} alt="weather" width={width} />
}

type WeatherForecastProps = {
    weather: IWeatherCurrent
}

const WeatherForecast = (props: WeatherForecastProps) => {
    const {weather} = props;
    const date = new Date(weather.dt * 1000);

    return <Flex flexDirection="column" alignItems="center">
        <Text fontSize={[2]}>
            {("0" + date.getHours()).substr(-2)} Uhr
        </Text>
        <WeatherIcon icon={weather.weather[0].icon} width="100%" />
        <Text fontSize={[2]}>
            {Math.round(weather.main.temp)} °C
        </Text>
    </Flex>
}