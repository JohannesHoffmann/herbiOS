import React from "react";
import { Flex, Text } from 'rebass';
import IconOvernight from '../../ui/icons/IconOvernight';
import IconParking from '../../ui/icons/IconParking';
import IconWorking from '../../ui/icons/IconWorking';
import IconHiking from '../../ui/icons/IconHiking';
import IconSightSeeing from '../../ui/icons/IconSightSeeing';
import { IPoi } from "./IPoi";

type Props = {
    pois: Array<IPoi>;
    onClick?: (typeId: number) => void;
}

export default function PoiList(props: Props) {
    const {pois, onClick} = props;

    const getNumberOfPois = (typeId: number): number => {
        return pois.filter(poi => poi.typeId === typeId).length;
    } 

    const onTypeClick = (typeId: number) => {
        if (onClick) onClick(typeId);
    }

    return <Flex justifyContent="space-between">
    <Flex alignItems="center" onClick={() => onTypeClick(1)}>
        <IconOvernight color="primary" secondary="grey" width={35} /> 
        <Text ml={2} fontSize={[3]}>{getNumberOfPois(1)}</Text>
    </Flex>
    <Flex alignItems="center" onClick={() => onTypeClick(2)}>
        <IconParking color="primary" width={35} /> 
        <Text ml={2} fontSize={[3]}>{getNumberOfPois(2)}</Text>
    </Flex>
    <Flex alignItems="center" onClick={() => onTypeClick(3)}>
        <IconWorking width={35} /> 
        <Text ml={2} fontSize={[3]}>{getNumberOfPois(3)}</Text>
    </Flex>
    <Flex alignItems="center" onClick={() => onTypeClick(4)}>
        <IconHiking color="primary" width={35} /> 
        <Text ml={2} fontSize={[3]}>{getNumberOfPois(4)}</Text>
    </Flex>
    <Flex alignItems="center" onClick={() => onTypeClick(5)}>
        <IconSightSeeing color="primary" width={35} /> 
        <Text ml={2} fontSize={[3]}>{getNumberOfPois(5)}</Text>
    </Flex>
</Flex>
}