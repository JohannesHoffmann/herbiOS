import React from "react";
import { useTabsState } from "./TabsContext";

type Props = {
    tabId: string;
    children: React.ReactElement;
}

export default function TabContent (props: Props) {
    const {children, tabId} = props;
    const {active} = useTabsState();

    if (active !== tabId) {
        return null;
    }

    return <div>
        {children}
    </div>
}