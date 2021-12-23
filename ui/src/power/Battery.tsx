import React from 'react';
import { FaBatteryEmpty, FaBatteryFull, FaBatteryHalf, FaBatteryQuarter, FaBatteryThreeQuarters } from 'react-icons/fa';
import { Text } from 'rebass';

export default function Battery() {
    const batteryVolt = 13.5;
    const maxVolt: number = 14.2;
    const minVolt: number = 10.2;

    const inPercent = (): number => {
        const maxPercent = maxVolt - minVolt;
        const aktValue = batteryVolt - minVolt;
        const percentage = Math.round(100/ maxPercent * aktValue)
        return percentage < 0 ? 0 : percentage > 100 ? 100 : percentage;
    }

    const batteryIcon = (): React.ReactElement => {
        const percent = inPercent();
        let icon = <FaBatteryEmpty />;

        if (percent < 10) {
            icon = <FaBatteryEmpty />
        } else if (percent >=10 && percent < 37) {
            icon = <FaBatteryQuarter />
        } else if (percent >=37 && percent < 63) {
            icon = <FaBatteryHalf />
        } else if (percent >=63 && percent < 90) {
            icon = <FaBatteryThreeQuarters />
        } else {
            icon = <FaBatteryFull />
        }

        return icon;
    }

    return <Text paddingX={2}>
        {inPercent()}% {batteryIcon()}
    </Text>
}