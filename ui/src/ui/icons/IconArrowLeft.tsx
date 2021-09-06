import React from "react";
import useThemeColor from "../../utils/useThemeColor";
import { IconProps } from "./IIcons";

export default function IconArrowLeft(props: IconProps) {
    const color = useThemeColor(props.color);
    const { height } = props;
    const width = props.width ? props.width : 44;

    return <svg width={width} height={height} viewBox="0 0 31 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill={color}
        d="M9.276.547c.23-.197.52-.305.864-.305.687 0 1.24.467 1.24 1.058 0 .296-.147.565-.386.771L3.706 8.203l7.288 6.115c.24.206.385.484.385.77 0 .593-.552 1.059-1.239 1.059a1.29 1.29 0 01-.864-.305l-8.1-6.814c-.292-.233-.427-.52-.438-.834 0-.313.146-.582.438-.824l8.1-6.823z"
      ></path>
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M2.6 8.195h26.922"
      ></path>
    </svg>
    
}