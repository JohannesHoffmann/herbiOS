import React from "react";
import useThemeColor from "../../utils/useThemeColor";
import { IconProps } from "./IIcons";

export default function IconSettings(props: IconProps) {
    const color = useThemeColor(props.color);
    const { height } = props;
    const width = props.width ? props.width : 44;

    return <svg width={width} height={height} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28.5" cy="15.5" r="2.5" fill={color}/>
        <line x1="9" y1="15.5" x2="24" y2="15.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="33" y1="15.5" x2="36" y2="15.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="30.5" cy="29.5" r="2.5" fill={color}/>
        <line x1="9" y1="29.5" x2="26" y2="29.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="35" y1="29.5" x2="36" y2="29.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="22.5" cy="22.5" r="2.5" fill={color}/>
        <line x1="9" y1="22.5" x2="18" y2="22.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="27" y1="22.5" x2="36" y2="22.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    
}