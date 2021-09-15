import React from "react";
import { Box, BoxProps, Heading } from "rebass";

type Props = {
    children: string;
}

export default function ListHeader (props: Props & Omit<BoxProps, "children">) {
    const {children} = props
    
    return <Box {...props} pb={2}>
        <Heading color="green">{children}</Heading>
    </Box>
}