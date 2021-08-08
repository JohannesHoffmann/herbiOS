import React from "react";
import { Button, Flex, Text } from "rebass";
import { IconProps } from "../icons/IIcons";
import { useTabsDispatch, useTabsState } from "./TabsContext";

export type Props = {
    tabId: string;
    children: React.ReactElement<IconProps>;
    label?: string;
}

export default function TabButton (props: Props) {
    const {children, tabId, label} = props;
    const tabsState = useTabsState();
    const setActive = useTabsDispatch();
    const active = tabsState.active === tabId;

    const onClick = () => {
        setActive({type: "ACTIVE_SET", tabId});
    }



    return <Flex flexDirection="column" alignItems="center" mr={2} ml={2}>
        <Button
            sx={{
                backgroundColor: active ? "primary" : "background",
            }}
            p={1}
            onClick={onClick}
        >
            {React.cloneElement(children, {color: active ? "background" : "grey"})}
        </Button>
        {label && <Text mt={2} sx={{color: active ? "primary" : "background"}}>{label}</Text>}
    </Flex>
}