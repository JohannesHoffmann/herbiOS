import React from "react";
import useThemeColor from "../../utils/useThemeColor";
import { IconProps } from "./IIcons";

export default function IconSightSeeing(props: IconProps) {
    const color = useThemeColor(props.color);
    const { height } = props;
    const width = props.width ? props.width : 44;

    return <svg width={width} height={height} viewBox="0 0 29 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        stroke={color}
        d="M28.5 7.648V20.5A2.5 2.5 0 0126 23H3a2.5 2.5 0 01-2.5-2.5V6.174c0-.567.46-1.026 1.026-1.026h.207a1.82 1.82 0 001.82-1.82.82.82 0 01.82-.82h.794a.82.82 0 01.82.82v.175a1.645 1.645 0 103.29 0v-.93C9.276 1.706 9.98 1 10.85 1h8.063c.87 0 1.574.705 1.574 1.574a2.574 2.574 0 002.574 2.574H26a2.5 2.5 0 012.5 2.5z"
      ></path>
      <path
        fill={color}
        stroke={color}
        d="M21.5 12.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
      ></path>
      <path
        fill="#fff"
        stroke="#fff"
        d="M15 18a5.5 5.5 0 100-11 5.5 5.5 0 000 11z"
      ></path>
    </svg>
}