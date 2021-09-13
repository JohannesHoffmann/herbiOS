import React from "react";
import { Box } from "rebass";
import { useState } from "react";
import ModalBackground from "./ModalBackground";
import ModalContent from "./ModalContent";

type Props = {
    children: React.ReactNode;
    open?: boolean;
    onClose?: () => void,
}

export default function Modal(props: Props) {
    const {children, open, onClose} = props;

    return <Box
        sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            top: "100vh",
        }}
    >

        <ModalBackground open={open} onClose={onClose} />
        <ModalContent open={open}>
            {children}
        </ModalContent>

    </Box>;
}