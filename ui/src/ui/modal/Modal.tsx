import React from "react";
import { Box, Flex } from "rebass";
import { useState } from "react";
import { useSpring, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'

type Props = {
    children: React.ReactNode;
    open?: boolean;
    onClose?: () => void;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    subModal?: boolean;
}

export default function Modal(props: Props) {
    const {children, open, header, footer, subModal} = props;
    const onClose = props.onClose ? props.onClose : () => {};
    const [hide, setHide] = useState(true);

    const [wrapper, setWrapper] = useSpring(() => ({
            transform: `translateY(-90vh)`,
            opacity: 0,
     }));

     const setClose = React.useCallback(() => {
         if (!subModal) {
             /* when modal active */
            document.body.style.overflow = "auto";
            document.body.style.touchAction = "auto";
            document.body.style.overscrollBehavior = "auto";
            //@ts-ignore
            document.body.style["-webkit-overflow-scrolling"] = "auto";
         }
        setWrapper({
            transform: "translateY(0vh)",
            opacity: 0,
            onRest:() => {
                    setHide(true);
            },
        });
     }, [setWrapper, subModal]);

     const setOpen = React.useCallback(() => {
         if (!subModal) {
             document.body.style.overflow = "hidden";
             document.body.style.touchAction = "none";
             document.body.style.overscrollBehavior = "none";
             //@ts-ignore
             document.body.style["-webkit-overflow-scrolling"] = "none";
         }

        setWrapper({
            transform: "translateY(-90vh)",
            opacity: 0.8,
            onStart: () => {
                    setHide(false);
            }
        });
     }, [setWrapper, subModal]);

     React.useEffect(() => {
        if (open) {
           setOpen();
        } else {
            setClose();
        }
     }, [open, setOpen, setClose]);


    // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
    const bind = useDrag(({ down, velocity, xy: [, y], cancel}) => {
        const percent = y * 100/window.innerHeight; // current cursor position in percent of the height

        if (percent >= 10) { // skips the top 10 percent because there is a gap
            const newVh = 90 - percent + 10;

            // When dragged to the lower 20 percent then close the modal.
            if (!down && (newVh <= 20 || velocity > 3)) {
                if (cancel) cancel();
                onClose();
                setClose();
                return;
            }

            // When release open modal
            if (!down && open) {
                setOpen();
                return;
            }

            const x = newVh > 90 ? 90 :
                newVh < 0 ? 0 :
                newVh;
    
            setWrapper({
                transform: `translateY(-${x}vh)`,
                opacity: 0.8 - (percent - 10) / 100,
            });
        }
    });


    return <Box
        sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            top: "100vh",
            zIndex: 1100,
        }}
    >

        <animated.div style={{
            position: "absolute",
            bottom: hide ? "-120vh" : "-0vh",
            opacity: wrapper.opacity,
            backgroundColor: "black",
            width: "100%",
            height: "100vh",
           
        }} 
        onClick={() => {onClose()}}
        />

        <animated.div style={{
            position: "absolute",
            bottom: hide ? "-180vh" : "-90vh",
            width: "100%",
            height: "90vh",
            transform: wrapper.transform,
        }} >
            <Flex
                flexDirection="column"
                sx={{
                    backgroundColor: "background",
                    width: "100%",
                    height: "100%",
                    borderTopLeftRadius: "10px 10px",
                    borderTopRightRadius: "10px 10px",
                }}
            >
                <Flex
                    {...bind()}
                    flexDirection="column"
                    sx={{
                        width: "100%",
                    }}
                    p={3}
                >
                    <Box                  
                        sx={{
                            height: 6,
                            borderRadius: "3px 3px",
                            background: "grey",
                            width: "50%",
                            alignSelf: "center"
                        }}
                    />
                </Flex>
                {!hide && <>
                    {header && <Box>
                        {header}
                    </Box>}
                    <Flex
                        p={3}
                        sx={{
                            overflow: "auto",
                        }}
                        flexDirection="column"
                    >
                        {children}
                    </Flex>
                    {footer && <Flex
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            zIndex: 400,
                        }}
                        p={2}
                        justifyContent="center"
                    >
                        {footer}
                    </Flex>}
                </>}
            </Flex>
        </animated.div>
    </Box>;
}