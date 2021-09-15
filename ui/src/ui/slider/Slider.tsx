import React from "react";
import { Box, Flex, Heading } from "rebass";
import { useState } from "react";
import { useSpring, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import IconChevronLeft from "../icons/IconChevronLeft";

type Props = {
    children: React.ReactNode;
    open?: boolean;
    onClose?: () => void,
    label?: string;
    subSlider?: boolean;
}

export default function Slider(props: Props) {
    const {children, open, label, subSlider} = props;
    const onClose = props.onClose ? props.onClose : () => {};
    const [hide, setHide] = useState(true);

    const [wrapper, setWrapper] = useSpring(() => ({
            transform: `translateX(-100vw)`,
            opacity: 0,
     }));

     const setClose = React.useCallback(() => {
         if (!subSlider) {
             /* when modal active */
            document.body.style.overflow = "auto";
            document.body.style.touchAction = "auto";
            document.body.style.overscrollBehavior = "auto";
            //@ts-ignore
            document.body.style["-webkit-overflow-scrolling"] = "auto";
         }

        setWrapper({
            transform: "translateX(0vw)",
            opacity: 0,
            onRest:() => {
                    setHide(true);
            },
        });
     }, [setWrapper, subSlider]);

     const setOpen = React.useCallback(() => {
        if (!subSlider) {
            document.body.style.overflow = "hidden";
            document.body.style.touchAction = "none";
            document.body.style.overscrollBehavior = "none";
            //@ts-ignore
            document.body.style["-webkit-overflow-scrolling"] = "none";
        }

        setWrapper({
            transform: "translateX(-100vw)",
            opacity: 0.8,
            onStart: () => {
                    setHide(false);
            }
        });
     }, [setWrapper, subSlider]);

     React.useEffect(() => {
        if (open) {
           setOpen();
        } else {
            setClose();
        }
     }, [open, setOpen, setClose]);


    // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
    const bind = useDrag(({ down, velocity, xy: [x], cancel}) => {
        const percent = x * 100/window.innerWidth; // current cursor position in percent of the height

            const newVw = 100 - percent;

            // When dragged to the lower 20 percent then close the modal.
            if (!down && (newVw <= 20 || velocity > 2)) {
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

            const transformX = newVw > 90 ? 90 :
                newVw < 0 ? 0 :
                newVw;
    
            setWrapper({
                transform: `translateX(-${transformX}vw)`,
            });
        });


    return <Box
        sx={{
            position: "fixed",
            bottom: 0,
            left: "100vw",
            right: 0,
            top: 0,
            zIndex: 99999,
        }}
    >
        <animated.div style={{
            position: "absolute",
            right: hide ? "-200vw" : "-100vw",
            top: 0,
            width: "100vw",
            height: "100vh",
            transform: wrapper.transform,
        }} >
            <Flex
                sx={{
                    backgroundColor: "background",
                    width: "100%",
                    height: "100%",
                }}
                p={0}
            >
                <Box
                    {...bind()}
                    sx={{
                        width: 16,
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                    }}
                    p={0}
                    flexGrow={0}
                >
                </Box>
                <Flex 
                    p={0} 
                    pt={4} 
                    flexGrow={1}
                    flexDirection="column"
                >

                    {label && <Flex  
                        mb={2}
                        pl={3}
                        flexDirection="row" 
                        alignItems="center" 
                        onClick={() => {onClose();}}
                    >
                        <IconChevronLeft color="green" height={20} width={16} />
                        <Heading ml={2} color="green">{label}</Heading>
                    </Flex>}

                    {!hide && <Box
                        p={3} 
                        pt={2}
                        sx={{
                            overflowY: "scroll",
                        }}
                    >
                        {children}
                    </Box>}

                </Flex>
            </Flex>
        </animated.div>
    </Box>;
}