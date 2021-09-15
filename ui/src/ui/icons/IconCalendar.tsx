import React from "react";
import useThemeColor from "../../utils/useThemeColor";
import { IconProps } from "./IIcons";

export default function IconCalendar(props: IconProps) {
    const color = useThemeColor(props.color);
    const background = useThemeColor("background");
    const { height } = props;
    const width = props.width ? props.width : 44;

    return <svg width={width} height={height} viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask
        id="mask0"
        style={{ maskType: "alpha" }}
        width="18"
        height="20"
        x="0"
        y="0"
        maskUnits="userSpaceOnUse"
      >
        <path
          fill={background}
          fillRule="evenodd"
          d="M16 20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2h-1V0h-2v2H5V0H3v2H2C.89 2 .01 2.9.01 4L0 18a2 2 0 002 2h14zM6 11V9H4v2h2zM2 6h14V4H2v2zm14 2v10H2V8h14zm-2 3V9h-2v2h2zm-4 0H8V9h2v2z"
          clipRule="evenodd"
        ></path>
      </mask>
      <g mask="url(#mask0)">
        <path fill={color} d="M21-2H-3v24h24V-2z"></path>
      </g>
    </svg>
}