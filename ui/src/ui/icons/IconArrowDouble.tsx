import React from "react";
import useThemeColor from "../../utils/useThemeColor";
import { IconProps } from "./IIcons";

export default function IconArrowDouble(props: IconProps) {
    const color = useThemeColor(props.color);
    const { height } = props;
    const width = props.width ? props.width : 44;

    return <svg width={width} height={height} viewBox="0 0 30 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill={color}
        d="M9.276.547c.23-.197.52-.305.864-.305.687 0 1.24.467 1.24 1.058 0 .296-.147.565-.386.771L3.706 8.203l7.288 6.115c.24.206.385.484.385.77 0 .593-.552 1.059-1.239 1.059a1.29 1.29 0 01-.864-.305l-8.1-6.814c-.292-.233-.427-.52-.438-.834 0-.313.146-.582.438-.824l8.1-6.823zM20.984 15.842a1.29 1.29 0 01-.864.305c-.687 0-1.239-.466-1.239-1.058 0-.296.146-.565.386-.771l7.288-6.132-7.288-6.115c-.24-.206-.386-.484-.386-.77 0-.592.552-1.059 1.24-1.059.343 0 .634.108.863.305l8.1 6.814c.292.233.428.52.438.833 0 .314-.146.583-.437.825l-8.1 6.823z"
      ></path>
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M2.522 8.147h24"
      ></path>
    </svg>
    
}