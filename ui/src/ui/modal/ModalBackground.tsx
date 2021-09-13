import React, {useState} from "react";
import { useSpring, animated } from '@react-spring/web'
import { useEffect } from "styled-components/node_modules/@types/react";

type Props = {
    open?: boolean
    onClose?: () => void,
}

export default function ModalBackground(props: Props) {
    const {open} = props;
    const onClose = props.onClose ? props.onClose : () => {};
    const [hide, setHide] = useState(true);

    const spring = useSpring ({ 
        background: "black",
        width: "100%",
        height: "100vh",
        opacity: open ? 0.8 : 0,
        
        onRest:() => {
            if (!open) {
                setHide(true);
                document.body.style.overflow = "auto";
            }
        },
        onStart: () => {
            if (open) {
                setHide(false);
                document.body.style.overflow = "hidden";
            }
        }
        
    })

    return <animated.div style={{
        position: "absolute",
        bottom: hide ? "-100vh" : "-0vh",
        ...spring,
    }} 
    onClick={() => {console.log("Clicked"); onClose()}}
    />

}