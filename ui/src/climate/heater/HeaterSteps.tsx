import React, { useMemo } from "react";
import { Box } from "rebass";
import { useDrag } from "react-use-gesture";
import theme from "../../theme";
import { useEffect } from "react";
import { IClimateConfiguration, IClimateState } from "../IClimate";

type Props = {
    steps: Array<string>;
    state: string;
    onChange: (newState: string) => void;
}

function HeaterStepButton(props: Props) {
    const {state, steps, onChange} = props;
    const strength = steps.findIndex(step => step === state)  >= 0 ? steps.findIndex(step => step === state) : 0;
    const max: number = steps.length;

    // DnD stuff
    const sliderMax: number = 195;
    const sliderMin: number = 0;
    const [sliderX, setSliderX]= React.useState<number>(0);
    const dragValueStart = React.useRef(sliderX);
    const dragging = React.useRef(false);

    const [value, setValue]= React.useState<number>(0);

    // update sliderX when strength gets update from server
    useEffect(() => {
        if (dragging.current) {
            return;
        }
        const strengthInValue = strength;
        const posOfStrengthMin = Math.floor(sliderMax / max * strengthInValue);
        const posOfStrengthMax =  Math.ceil(sliderMax / max * (strengthInValue + 1));

        setValue(strengthInValue);

        setSliderX(sliderX => {
            if (sliderX >= posOfStrengthMin && sliderX <= posOfStrengthMax) {
                return sliderX;
            }

            const newXPosition =  Math.round(sliderMax / max * strengthInValue + (sliderMax / max / 2));
            dragValueStart.current = newXPosition;
            return newXPosition;
        });
    }, [setSliderX, strength]);

    const bind = useDrag(({ movement: [mx], first, last, direction }) => {
        if (first) {
            dragValueStart.current = sliderX;
            dragging.current = true;
        }
        if (direction[1] > 0.5 || direction[1] < -0.5) {
            return;
        }
       
        const newVal = sliderMax / window.innerWidth * 3 * mx;

        if (last) {
            dragging.current = false;
        }

        if (dragValueStart.current + newVal > sliderMax) {
             changeValue(sliderMax);
        } else if (dragValueStart.current + newVal < sliderMin) {
            changeValue(sliderMin);
        } else {
            changeValue(Math.round(dragValueStart.current + newVal));
        }
        

    });

    const changeValue = React.useCallback((newSliderX: number) => {
        setSliderX(newSliderX);
        const shouldSetValue = Math.floor((max)/ sliderMax * newSliderX);
        const valueToSet = shouldSetValue > (max - 1)? max - 1 : shouldSetValue;
        setValue(valueToSet);
        onChange(steps[valueToSet]);
    }, [setSliderX]);

    return <Box {...bind()} mr={-3} ml={-3} mt={2}>
        <svg
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit="2"
        clipRule="evenodd"
        viewBox="0 0 256 51"
      >
        <g transform={`translate(${sliderX} 0)`} id="Dragger">
          <path
            fill={theme.colors.primary}
            d="M45.476 23.25c0-5.795-4.705-10.5-10.5-10.5h-12c-5.795 0-10.5 4.705-10.5 10.5V40.5c0 5.795 4.705 10.5 10.5 10.5h12c5.795 0 10.5-4.705 10.5-10.5V23.25z"
          ></path>
          <path
            fill={theme.colors.background}
            d="M18.851 29.625a2.412 2.412 0 014.821 0 2.412 2.412 0 01-4.821 0zM26.565 29.625a2.412 2.412 0 114.82.001 2.412 2.412 0 01-4.82-.001zM34.28 29.625a2.412 2.412 0 014.821 0 2.412 2.412 0 01-4.821 0zM18.851 21.911a2.412 2.412 0 014.821 0 2.411 2.411 0 01-4.821 0zM26.565 21.911a2.412 2.412 0 112.411 2.41 2.412 2.412 0 01-2.411-2.41zM34.28 21.911a2.412 2.412 0 014.821 0 2.411 2.411 0 01-4.821 0z"
          ></path>
          <text fill={theme.colors.background} x="28.324px" y="44.995px" fontSize="11.057px" textAnchor="middle">{steps[value] === "off" ? "Aus" : steps[value]}</text>
        </g>

        <use href="#bg" clipPath="url(#line)"/>

        <defs>
            <path id="bg" d="M0,0l0,27l255.75,0l0,-27l-255.75,0Z" fill="url(#_Linear1)"/>

            <clipPath id="line">
                <path
                    transform={`translate(${sliderX} 0)`}
                    d="M-196.906 25.269H.801a7.262 7.262 0 006.993-5.304c1.484-5.289 6.378-13.7 21.932-13.7 5.676 0 9.801 1.328 12.789 3.293 4.407 2.899 6.3 7.158 7.125 10.292a7.252 7.252 0 007.004 5.418c32.172.065 206.805.366 206.805.366a1.314 1.314 0 00.005-2.625s-174.633-.301-206.805-.366a4.628 4.628 0 01-4.47-3.458l-.001-.002c-.948-3.605-3.152-8.484-8.22-11.818C40.63 5.176 36.049 3.64 29.726 3.64c-17.454 0-22.795 9.68-24.46 15.617a4.637 4.637 0 01-4.465 3.387h-197.707a1.313 1.313 0 100 2.625z"
                ></path>
            </clipPath>

          <linearGradient
            id="_Linear1"
            x1="0"
            x2="1"
            y1="0"
            y2="0"
            gradientTransform="translate(2.192 14.637) scale(253.558)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#dadada"></stop>
            <stop offset="0.01" stopColor="#dadada"></stop>
            <stop offset="0.01" stopColor="#dadada"></stop>
            <stop offset="0.01" stopColor="#dadada"></stop>
            <stop offset="0.04" stopColor="#30f561"></stop>
            <stop offset="0.24" stopColor="#fce838"></stop>
            <stop offset="0.48" stopColor="#f9d03f"></stop>
            <stop offset="0.73" stopColor="#f9983f"></stop>
            <stop offset="0.94" stopColor="#e95626"></stop>
            <stop offset="0.99" stopColor="#dbd2d0"></stop>
            <stop offset="1" stopColor="#dadada"></stop>
          </linearGradient>
        </defs>
      </svg>
    </Box>
}

export default HeaterStepButton;