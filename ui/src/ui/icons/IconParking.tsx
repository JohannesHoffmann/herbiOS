import React from "react";
import useThemeColor from "../../utils/useThemeColor";
import { IconProps } from "./IIcons";

export default function IconParking(props: IconProps) {
    const color = useThemeColor(props.color);
    const { height } = props;
    const width = props.width ? props.width : 44;

    return <svg width={width} height={height} viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        width="23"
        height="25"
        x="0.5"
        y="0.5"
        stroke={color}
        rx="2.5"
      ></rect>
      <path
        fill={color}
        d="M13.53 6.511c1.462 0 2.63.367 3.507 1.1.89.733 1.336 1.747 1.336 3.04 0 1.28-.446 2.293-1.336 3.04-.877.733-2.045 1.1-3.506 1.1h-2.068a1 1 0 00-1 1v2.92a1 1 0 01-1 1H9.23a1 1 0 01-1-1v-11.2a1 1 0 011-1h4.3zm-.354 6.44c.988 0 1.711-.193 2.17-.58.473-.387.71-.96.71-1.72s-.237-1.333-.71-1.72c-.459-.4-1.182-.6-2.17-.6h-1.713a1 1 0 00-1 1v2.62a1 1 0 001 1h1.713z"
      ></path>
    </svg>
}