import React from "react";
import useThemeColor from "../../utils/useThemeColor";
import { IconProps } from "./IIcons";

export default function IconDashboard(props: IconProps) {
    const color = useThemeColor(props.color);
    const { height } = props;
    const width = props.width ? props.width : 44;

    return <svg width={width} height={height} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="11.5" y="11.5" width="10" height="10" rx="2.5" fill={color} stroke={color}/>
    <rect x="23.5" y="11.5" width="10" height="10" rx="2.5" stroke={color}/>
    <rect x="11.5" y="23.5" width="10" height="10" rx="2.5"  stroke={color}/>
    <rect x="23.5" y="23.5" width="10" height="10" rx="2.5"  stroke={color}/>
    </svg>
    
}