import React from "react";
import { Box, Flex } from "rebass";
import { useSpring, animated } from '@react-spring/web'

type Props = {
    children: React.ReactNode;
    open?: boolean
}

export default function ModalContent(props: Props) {
    const {children, open} = props;
    const spring = useSpring ({ 
        bottom: "-90vh",
        width: "100%",
        height: "90vh",
        transform: `translateY(${open ? "-90vh" : "0vh"})`
    })

    return <animated.div style={{
        position: "absolute",
        ...spring,
    }} >
        <Flex
            flexDirection="column"
            sx={{
                background: "white",
                width: "100%",
                height: "100%",
                borderTopLeftRadius: "10px 10px",
                borderTopRightRadius: "10px 10px",
            }}
            p={4}
        >
            {children}
        </Flex>
    </animated.div>
}