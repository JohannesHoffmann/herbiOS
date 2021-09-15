import React from "react";
import { Flex, Text } from 'rebass';
import IconOvernight from '../../ui/icons/IconOvernight';
import IconParking from '../../ui/icons/IconParking';
import IconWorking from '../../ui/icons/IconWorking';
import IconHiking from '../../ui/icons/IconHiking';
import IconSightSeeing from '../../ui/icons/IconSightSeeing';

export default function PoiList() {
    return <Flex justifyContent="space-between">
    <Flex alignItems="center">
        <IconOvernight color="primary" secondary="grey" width={35} /> <Text ml={2} fontSize={[3]}>0</Text>
    </Flex>
    <Flex alignItems="center">
        <IconParking color="primary" width={35} /> <Text ml={2} fontSize={[3]}>0</Text>
    </Flex>
    <Flex alignItems="center">
        <IconWorking width={35} /> <Text ml={2} fontSize={[3]}>0</Text>
    </Flex>
    <Flex alignItems="center">
        <IconHiking color="primary" width={35} /> <Text ml={2} fontSize={[3]}>0</Text>
    </Flex>
    <Flex alignItems="center">
        <IconSightSeeing color="primary" width={35} /> <Text ml={2} fontSize={[3]}>0</Text>
    </Flex>
</Flex>
}