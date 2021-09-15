import React from "react";
import useThemeColor from "../../utils/useThemeColor";
import { IconProps } from "./IIcons";

export default function IconBusStop(props: IconProps) {
    const color = useThemeColor(props.color);
    const secondary = useThemeColor(props.secondary);
    const { height } = props;
    const width = props.width ? props.width : 44;

    return <svg width={width} height={height} viewBox="0 0 53 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill={color}
        stroke={color}
        strokeLinecap="round"
        d="M42.879.55H13.16a3 3 0 00-2.927 2.341l-.849 3.768L6.876 17.8l-.47 2.091a3 3 0 002.926 3.66H47.084a3 3 0 002.902-2.242l1.713-6.546a3 3 0 00-1.499-3.41l-.425-.225a3 3 0 01-1.399-1.583l-2.694-7.064A3 3 0 0042.879.55z"
      ></path>
      <path
        stroke={secondary}
        d="M35.879 8.64l.794-3.03a1 1 0 01.967-.747h3.727a1 1 0 01.967.746l.794 3.031a1 1 0 01-.967 1.254h-5.315a1 1 0 01-.967-1.254z"
      ></path>
      <path
        fill={color}
        stroke={color}
        d="M18.421 24.475c-.636 2.258-3.265 3.668-5.107 3.148-1.843-.519-2.82-2.77-2.184-5.028.637-2.258 3.266-3.668 5.108-3.149 1.842.52 2.82 2.771 2.183 5.03zM44.84 25.05c-.637 2.258-3.266 3.667-5.108 3.148-1.843-.52-2.82-2.77-2.184-5.029.637-2.258 3.266-3.668 5.108-3.148 1.842.52 2.82 2.77 2.183 5.029z"
      ></path>
      <path
        stroke={color}
        strokeLinecap="round"
        d="M15.863 10.25L5.363 10.25"
      ></path>
      <path
        stroke={color}
        strokeLinecap="round"
        d="M11.55 12.55L1.05 12.55"
      ></path>
      <path
        fill={secondary}
        d="M13.5 10.825a.5.5 0 000-1v1zm0-1H7.45v1h6.05v-1zM14.925 13.125a.5.5 0 000-1v1zm0-1h-8.05v1h8.05v-1z"
      ></path>
      <path stroke={color} strokeLinecap="round" d="M17.875 16L8.525 16"></path>
      <path
        stroke={secondary}
        strokeLinecap="round"
        strokeWidth="2"
        d="M24 7v11M28 7v11"
      ></path>
    </svg>
}