import React from "react";
import useThemeColor from "../../utils/useThemeColor";
import { IconProps } from "./IIcons";

export default function IconAirPlay(props: IconProps) {
    const color = useThemeColor(props.color);
    const { height } = props;
    const width = props.width ? props.width : 18;

    return <svg width={width} height={height} viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.79265 8.25533C8.89174 8.10822 9.10826 8.10822 9.20735 8.25533L14.3299 15.8603C14.4417 16.0264 14.3228 16.25 14.1225 16.25H3.87746C3.67724 16.25 3.55826 16.0264 3.67011 15.8603L8.79265 8.25533Z" fill={color} stroke={color} strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 11.1458C5.37764 10.4407 5 9.51445 5 8.5C5 6.29086 6.79086 4.5 9 4.5C11.2091 4.5 13 6.29086 13 8.5C13 9.51445 12.6224 10.4407 12 11.1458" stroke={color} strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.5 12.5C3.56645 11.439 3 10.0453 3 8.51882C3 5.19472 5.68629 2.5 9 2.5C12.3137 2.5 15 5.19472 15 8.51882C15 10.0453 14.4335 11.439 13.5 12.5" stroke={color} strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 13.5C1.75527 12.1207 1 10.3088 1 8.32446C1 4.00313 4.58172 0.5 9 0.5C13.4183 0.5 17 4.00313 17 8.32446C17 10.3088 16.2447 12.1207 15 13.5" stroke={color} strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    
    
}