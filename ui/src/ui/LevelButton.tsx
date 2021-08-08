import React from "react";
import { Box, SxStyleProp, Text } from "rebass";
import { useDrag } from "react-use-gesture";


type Props = {
    label: string;
    value?: number;
    step?: number;
    max?: number;
    min?: number;
    unit?: string;
    disabled?: boolean;
    onChange?: (data: number) => void;
};

function LevelButton(props: Props) {
    const { label, onChange, disabled } = props;

    const step: number = props.step ? props.step : 20;
    const max: number = props.max ? props.max : 100;
    const min: number = props.min ? props.min : 0;
    const unit: string = props.unit ? props.unit : "%";
    
    const [value, setValue]= React.useState<number>(props.value ? props.value : 0);
    const [clicks, setClicks] = React.useState<number>(0);

    const dragValueStart = React.useRef(value);

    const dblDelayTime = 200;

    React.useEffect(() => {
        if (props.value !== undefined) {
            setValue(props.value);
        }
    }, [props.value]);

    const changeValue = React.useCallback((newValue: number) => {
        setValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    }, [onChange]);

    React.useEffect(() => {
        const doSingleClick = () => {
            if (disabled) {
                return;
            }

            if (value - step < min) {
                changeValue(max);
            } else {
                changeValue(Math.round((value - step) * 10) / 10);
            }
        };

        const doDoubleClick = () => {
            if (disabled) {
                return;
            }

            if (value > min) {
                changeValue(min);
            } else {
                changeValue(max);
            }
        };

        let singleClickTimer: any;
        if (clicks === 1) {
            singleClickTimer = setTimeout(function () {
                doSingleClick();
                setClicks(0);
            }, dblDelayTime);
        } else if (clicks === 2) { 
            doDoubleClick();
            setClicks(0);
        }
        return () => clearTimeout(singleClickTimer);
    }, [clicks, value, min, max, step, changeValue, disabled]);


    const bind = useDrag(({ event, elapsedTime, movement: [mx, my], first, last, direction }) => {
        if (disabled) {
            return;
        }
        if (first) {
            dragValueStart.current = value;
        }
        if (direction[1] > 0.5 || direction[1] < -0.5) {
            return;
        }
       
        const newVal = max / window.innerWidth * 3 * mx;

        if (dragValueStart.current + newVal > max) {
             changeValue(max);
        } else if (dragValueStart.current + newVal < min) {
            changeValue(min);
        } else {
            changeValue(Math.round(dragValueStart.current + newVal));
        }

        if (last && elapsedTime > 120) {
            setClicks(3);
            setTimeout(function () {
                setClicks(0);
            }, dblDelayTime);

        }
    });

    let color: SxStyleProp = {
        backgroundColor: "primary",
        backgroundImage: theme => `linear-gradient(90deg,  ${theme.colors.primary} 0%, ${theme.colors.primary} ${value/max * 100}%, ${theme.colors.grey} ${value/max * 100}%, ${theme.colors.grey} 100%);`,
    }

    if (disabled) {
        color.backgroundImage = undefined;
        color.backgroundColor = "grey";
    }

    return (
        <Box
            {...bind()}
            p={3}
            fontSize={4}
            color="white"
            sx={{
                ...color,
            }}
            variant="tile"
            onClick={() => setClicks((clicks) => clicks + 1)}
            height="100%"
            style={{touchAction: "manipulation"}}
        >
            <Text fontSize={[3, 4, 5]} color="white">
                {label}
            </Text>
            <Text fontSize={[5, 6, 7]} fontWeight="bold" color="white">
                {value === 0 && <>Aus</>}
                {value > 0 && <>{value} {unit}</>}
            </Text>
        </Box>
    );
}

export default LevelButton;