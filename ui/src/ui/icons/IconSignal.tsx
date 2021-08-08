import React from "react";
import useThemeColor from "../../utils/useThemeColor";
import { IconProps } from "./IIcons";

export default function IconSignal(props: IconProps) {
    const color = useThemeColor(props.color);
    const { height } = props;
    const width = props.width ? props.width : 21;

    return <svg width={width} height={height} viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.7999 4.2C16.2147 5.6 18.5999 10.6 13.7999 13.8" stroke={color} strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15.3999 1C18.5999 2.6 23.3999 11.4 15.3999 17" stroke={color} strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.97571 13.8C4.56091 12.4 2.17571 7.4 6.97571 4.2" stroke={color} strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.37805 17C2.17805 15.4 -2.62195 6.6 5.37805 1" stroke={color} strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="10.5999" cy="9" r="2.95" fill={color} stroke={color} strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    
    
    
}