import React from "react";
import { Flex, Text } from "rebass";
import IconBusStart from "../ui/icons/IconBusStart";


export default function TourButton() {

    return <Flex
        flexDirection="column"
        alignItems="center"
    >
        <IconBusStart color="green" secondary="white" />
        <Text color="green">Starte Tour</Text>
    </Flex>
}