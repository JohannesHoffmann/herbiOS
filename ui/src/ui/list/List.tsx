import React from "react";
import { Box } from "rebass";

type Props = {
    children: React.ReactNode;
}

export default function List (props: Props) {
    const {children} = props

    return <Box mb={4}>
        {children}
    </Box>
}