import React from "react";
import useThemeColor from "../../utils/useThemeColor";
import { IconProps } from "./IIcons";

export default function IconBus(props: IconProps) {
    const color = useThemeColor(props.color);
    const secondary = useThemeColor(props.secondary);
    const { height } = props;
    const width = props.width ? props.width : 44;

    return <svg width={width} height={height} viewBox="0 0 52 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill={color}
        stroke={color}
        strokeLinecap="round"
        d="M42.329 1H12.61a3 3 0 00-2.926 2.34l-.85 3.77-2.508 11.14-.47 2.09A3 3 0 008.781 24h37.751a3 3 0 002.903-2.24l1.712-6.547a3 3 0 00-1.498-3.41l-.425-.226a3 3 0 01-1.4-1.582l-2.693-7.064A3 3 0 0042.329 1z"
      ></path>
      <path
        fill={color}
        stroke={color}
        d="M17.871 24.925c-.637 2.258-3.265 3.668-5.108 3.148-1.842-.519-2.82-2.77-2.183-5.029.637-2.258 3.265-3.667 5.108-3.148 1.842.52 2.82 2.771 2.183 5.03zM44.289 25.5c-.637 2.258-3.265 3.667-5.108 3.148-1.842-.52-2.82-2.77-2.183-5.029.637-2.258 3.265-3.668 5.108-3.148 1.842.52 2.82 2.77 2.183 5.029z"
      ></path>
      <path
        stroke={secondary}
        d="M33.828 9.228l.794-3.031a1 1 0 01.968-.747h6.11a1 1 0 01.948 1.317l-1.013 3.031a1 1 0 01-.949.683h-5.89a1 1 0 01-.968-1.253zM18.943 9.106l1.1-3a1 1 0 01.939-.656h8.375a1 1 0 01.974 1.227l-.7 3a1 1 0 01-.974.773h-8.775a1 1 0 01-.939-1.344z"
      ></path>
      <path
        stroke={color}
        strokeLinecap="round"
        d="M15.313 10.7L4.813 10.7"
      ></path>
      <path stroke={color} strokeLinecap="round" d="M11 13L0.5 13"></path>
      <path
        fill={secondary}
        d="M12.95 11.275a.5.5 0 100-1v1zm0-1H6.9v1h6.05v-1zM14.375 13.575a.5.5 0 100-1v1zm0-1h-8.05v1h8.05v-1z"
      ></path>
      <path
        stroke={color}
        strokeLinecap="round"
        d="M17.325 16.45L7.975 16.45"
      ></path>
    </svg>
}