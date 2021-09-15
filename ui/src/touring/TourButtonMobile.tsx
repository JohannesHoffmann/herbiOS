import React from "react";
import { Flex, Text } from "rebass";
import { useState } from "react";
import IconBusStart from "../ui/icons/IconBusStart";
import Modal from "../ui/modal/Modal";
import TourForm from "./TourForm";
import { useWebSocket } from "../utils/useWebSocket";
import { ITour } from "./ITour";
import IconBusStop from "../ui/icons/IconBusStop";


export default function TourButtonMobile() {
    const [open, setOpen] = useState<boolean>(false);
    const [tour] = useWebSocket<ITour,string>("activeTour", "/touring");

    const toggle = () => {
        setOpen(open => !open);
    }

    const onClose = () => {
        setOpen(false);
    }

    return <>
        <Flex
            sx={{
                borderRadius: "50% 50%",
                backgroundColor: "primary",
                width: 80,
                height: 80,
            }}
            p={2}
            mt={-32}
            justifyContent="center"
            alignItems="center"
            onClick={toggle}
        >
            
            {!tour && <IconBusStart color="white" secondary="primary" width={60} />}
            {tour && <IconBusStop color="white" secondary="primary" width={60} />}
        </Flex>
        <Modal 
            open={open} 
            onClose={onClose}
            header={<Text alignSelf="center" mb={2} textAlign="center">
                {tour && "Tour bearbeiten"}
                {!tour && "Tour erstellen"}
            </Text>}
        >
            
            <TourForm 
                tourId={tour ? tour.id : undefined} 
                propsMap={{showCurrentPosition: true}}
                onTourClose={onClose}
            />
        </Modal>
    </>
}