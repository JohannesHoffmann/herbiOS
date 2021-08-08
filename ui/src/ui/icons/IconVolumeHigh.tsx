import React from "react";
import useThemeColor from "../../utils/useThemeColor";
import { IconProps } from "./IIcons";

export default function IconVolumeHigh(props: IconProps) {
    const color = useThemeColor(props.color);
    const { height } = props;
    const width = props.width ? props.width : 19;

    return <svg width={width} height={height} viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.84861 4C3.94732 4 4.04383 3.97078 4.12596 3.91603L9.22265 0.518233C9.55493 0.296715 10 0.534911 10 0.934259V12.6295C10 13.0154 9.58139 13.2558 9.24806 13.0614L4.11676 10.0681C4.04029 10.0235 3.95335 10 3.86483 10H0.5C0.223858 10 0 9.77614 0 9.5V4.5C0 4.22386 0.223858 4 0.5 4H3.84861Z" fill={color}/>
        <path d="M13 4.5C14.3333 5.5 16.2 8.1 13 10.5" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15.5 2C16.5 2.5 18.5 4 18.5 7.5C18 11 16.5 12.5 15 13.5" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14.5 3.5C16.3333 5 18.5 8.5 14 12" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    
    
}