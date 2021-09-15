import React from "react";
import useThemeColor from "../../utils/useThemeColor";
import { IconProps } from "./IIcons";

export default function IconChevronLeft(props: IconProps) {
    const color = useThemeColor(props.color);
    const { height } = props;
    const width = props.width ? props.width : 44;

    return <svg width={width} height={height} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill={color}
        d="M10.8 2.58a1 1 0 00-.001-1.417l-.362-.36a1 1 0 00-1.412.003L.546 9.293a1 1 0 000 1.414l8.487 8.486a1 1 0 001.414 0l.356-.356a1 1 0 000-1.414l-6.716-6.716a1 1 0 010-1.414L10.8 2.579z"
      ></path>
    </svg>
}