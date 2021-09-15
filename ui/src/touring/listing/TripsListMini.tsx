import React from "react";
import { Card, Flex, Heading, Text } from "rebass";
import { ITour } from "../ITour";
import {format} from "date-fns";

type Props = {
    tours: Array<ITour>;
    onSelect?: (id: number) => void;
}

export default function TripsListMini (props: Props) {
    const {tours, onSelect} = props;

    const onClick = (id: number) => {
        if (onSelect) onSelect(id);
    }

    return <>
        {tours.map(tour => <Card 
            key={tour.id}
        >
            <Flex flexDirection="column" onClick={() => { onClick(tour.id); }}>
                <Heading>{tour.name}</Heading>
                <Text>
                    Von {format(new Date(tour.startTime), "dd.MM")} bis {tour.endTime ? format(new Date(tour.endTime), "dd.MM.yyyy") : " jetzt"}
                </Text>
            </Flex>
        </Card>)}
    </>
}