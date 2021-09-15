import React from "react";
import { Box } from "rebass";

type Props = {
    children: React.ReactNode;
}

export default function ListItem (props: Props) {
    const {children} = props
    
    return <Box pb={2} pt={1}>
        {children}
    </Box>
}