import React from 'react';

export default function Clock () {

    const [time, setTime] = React.useState<Date>(new Date());

    React.useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());

        }, 30000);
        return () => clearInterval(interval);
    });

    function humanTime(d: Date) {
        return("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    }

    return <h1>
        {humanTime(time)}
    </h1>
}