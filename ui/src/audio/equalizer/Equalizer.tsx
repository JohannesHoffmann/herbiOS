import { useTheme } from 'emotion-theming';
import React from 'react';

const getRandomIntInclusive = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

type BarProps = {
    height: number;
    x: number;
    size: [number, number];
    variant?: Props["variant"];
    margin: number;
    play?: boolean
}

function EqualizerBar (props: BarProps) {
    const theme: any = useTheme();
    const {height, size, margin, x} = props;
    const variant: Props["variant"] = props.variant ? props.variant : "rect";
    const [impulse, setImpulse] = React.useState<number>(0);
    const direction = React.useRef<"up" | "down">("up");
    const time = 200;
    const sizeOfElement: number = variant === "circle" ? size[0] : size[1];
    const numberOfElements: number = Math.floor((height + margin) / (sizeOfElement+ margin));
    const restY = height - numberOfElements * (sizeOfElement + margin); // restY value is calculated to put equalizer to the bottom of the svg

    const [min, max] = React.useMemo(() => {
        if (props.play === false && props.play !== undefined) {
            return [0, 0];
        }

        return [
            getRandomIntInclusive(1, numberOfElements),
            getRandomIntInclusive(1, numberOfElements),
        ].sort((a, b) => a - b)
    }, [props.play]);

   

    React.useEffect(() => {
        const interval = setInterval(() => {
            setImpulse((oldImpulse) => {
                const newImpulse = getRandomIntInclusive(min, max);
    
                direction.current = "down";
                if (oldImpulse < newImpulse) {
                    direction.current = "up";
                }
                return newImpulse;
            });
        }, time);


        return () => {
            clearInterval(interval);
        }
    });

    return <g>
        {new Array(numberOfElements).fill(true).map((box, index) => {

            const delay = direction.current === "down" ?
                index * time / (numberOfElements) :
                (numberOfElements - index - 1) * time / (numberOfElements);

            if (variant === "circle") {
                const r = sizeOfElement / 2;
                return <circle
                    key={index}
                    fill={theme.colors.background}
                    style={{
                        opacity: numberOfElements - index <= impulse ? 0.7 : 0,
                        transition: `opacity ${Math.round(time / numberOfElements)}ms ease-in-out ${Math.round(delay)}ms`,
                    }}
                    cx={x + r}
                    cy={index * (2* r + margin) + r + restY}
                    r={r}
                />
            }

            return <rect
                key={index}
                fill={theme.colors.background}
                style={{
                    opacity: numberOfElements - index <= impulse ? 0.7 : 0,
                    transition: `opacity ${Math.round(time / numberOfElements)}ms ease-in-out ${Math.round(delay)}ms`,
                }}
                x={x}
                y={index * (size[1] + margin) + restY}
                width={size[0]}
                height={size[1]}
            />
        })}
    </g>;
}

type Props = {
    width: number;
    height: number;
    size?: number | [number, number];
    variant?: "circle" | "rect";
    play?: boolean;
    margin?: number
    style?: React.CSSProperties;
}

export default function Equalizer (props:  Props) {
    const {width, height, play, variant, style} = props;
    const margin = props.margin ? props.margin : 4;
    const size: [number, number] = props.size ? Array.isArray(props.size) ? props.size : [props.size, props.size] : [20, 10];
    
    return <svg style={style} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        {new Array(Math.floor((width + margin) / (size[0] + margin)))
            .fill(true)
            .map((box, index) => <EqualizerBar 
                x={index * (size[0] + margin)} 
                height={height} 
                play={play} 
                size={size} 
                variant={variant} 
                margin={margin}
                key={index} 
            />)}
    </svg>;
}