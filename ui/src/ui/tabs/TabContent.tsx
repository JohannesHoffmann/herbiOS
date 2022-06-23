import React from "react";
import { Box } from "rebass";
import { useTabsState } from "./TabsContext";

type Props = {
    tabId: string;
    children: React.ReactElement;
}

export default function TabContent (props: Props) {
    const {children, tabId} = props;
    const {active} = useTabsState();

    return <Box
        sx={{
            transform: active !== tabId ? "translateX(-100vw)" : undefined,
            position: active !== tabId ? "absolute" : "static",
            height: active !== tabId ? "0px" : "auto",
            overflow: active !== tabId ? "hidden" : "visible",
        }}
    >
        {children}
    </Box>
}