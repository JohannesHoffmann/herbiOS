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
            display: active !== tabId ? "none" : "block",
        }}
    >
        {children}
    </Box>
}