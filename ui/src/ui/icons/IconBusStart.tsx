import React from "react";
import useThemeColor from "../../utils/useThemeColor";
import { IconProps } from "./IIcons";

export default function IconBusStart(props: IconProps) {
    const color = useThemeColor(props.color);
    const secondary = useThemeColor(props.secondary);
    const { height } = props;
    const width = props.width ? props.width : 44;

    return <svg width={width} height={height} viewBox="0 0 46 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill={color}
        stroke={color}
        strokeLinecap="round"
        d="M36.538 1h-25.26a3 3 0 00-2.926 2.34l-.67 2.973L5.502 16l-.302 1.34A3 3 0 008.126 21h32.036a3 3 0 002.902-2.24l1.341-5.127a2.967 2.967 0 00-1.482-3.372 2.966 2.966 0 01-1.383-1.565l-2.2-5.765A3 3 0 0036.539 1z"
      ></path>
      <path
        stroke={color}
        strokeLinecap="round"
        d="M7.683 6.313l.669-2.972A3 3 0 0111.278 1h25.26a3 3 0 012.803 1.93l2.199 5.766a2.966 2.966 0 001.383 1.565v0a2.967 2.967 0 011.482 3.373l-1.34 5.125A3 3 0 0140.161 21H8.125A3 3 0 015.2 17.34L5.501 16"
      ></path>
      <path
        fill={secondary}
        stroke={color}
        d="M15.54 21.805c-.553 1.963-2.84 3.189-4.441 2.737-1.602-.452-2.452-2.41-1.899-4.373.554-1.963 2.84-3.19 4.442-2.738 1.602.452 2.452 2.41 1.898 4.373zM38.512 22.304c-.553 1.964-2.84 3.19-4.441 2.738-1.602-.452-2.452-2.41-1.899-4.373.554-1.964 2.84-3.19 4.442-2.738 1.602.452 2.452 2.41 1.898 4.373z"
      ></path>
      <path
        stroke={secondary}
        d="M30.328 7.872l.622-2.375a1 1 0 01.968-.747h3.04a1 1 0 01.967.747l.622 2.375a1 1 0 01-.968 1.253h-4.283a1 1 0 01-.968-1.253z"
      ></path>
      <path
        fill={secondary}
        stroke={secondary}
        d="M17.5 12.194V7.986a2 2 0 012.894-1.789L25.24 8.62c1.567.784 1.441 3.06-.203 3.666l-4.846 1.785a2 2 0 01-2.691-1.877z"
      ></path>
      <path
        stroke={color}
        strokeLinecap="round"
        d="M13.25 9.5L4.25 9.5"
      ></path>
      <path
        stroke={color}
        strokeLinecap="round"
        d="M9.5 11.5L0.5 11.5"
      ></path>
      <path
        fill={secondary}
        d="M13 10a.5.5 0 000-1v1zm0-1H6v1h7V9zM12.5 12a.5.5 0 000-1v1zm0-1h-7v1h7v-1z"
      ></path>
      <path stroke={secondary} strokeLinecap="round" d="M15 14.5L7 14.5"></path>
    </svg>
}