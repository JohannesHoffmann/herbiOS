import React from "react";
import useThemeColor from "../../utils/useThemeColor";
import { IconProps } from "./IIcons";

export default function IconHiking(props: IconProps) {
    const color = useThemeColor(props.color);
    const { height } = props;
    const width = props.width ? props.width : 44;

    return <svg width={width} height={height} viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.613 34c-1.57-2.05-3.77-5.973 0-7.286 4.712-1.64 9.66-2.137 7.09-5.828-2.056-2.953-3.775-3.962-4.203-4.372-1.81-.408-1.819-.244-4.65-.755M0 13.384a19.127 19.127 0 012.297 0 45.7 45.7 0 012.415.194m21.4 19.936c-2.57-1.914-6.493-4.03-3.41-5.343 3.856-1.64 9.853-5.353 5.998-8.634-3.084-2.625-5.283-4.102-5.997-4.512 1.46-.999 1.444-1.712 4.282-2.42m6.015.973c-2.143-1.49-4.968-1.234-6.015-.972m0 0V9.844m0 0c-1.57.273-4.37.082-2.999-2.871C25.7 3.28 23.986 0 26.985 0c2.399 0 3.57 4.922 3.855 7.383.428.82.257 2.46-3.855 2.46zM13.85 15.759v-2.224m0 2.224c-2.728-.491-6.631-1.92-9.14-2.181m9.14-.043h-2.57c-.286-2.46-.258-7.383 2.141-7.383s2.999 4.922 2.999 7.383h-2.57zm-9.14.043v-3.065m0 0H1.714C1.428 7.779 1.456 3.13 3.855 3.13s3.57 4.649 3.855 7.383H4.712z"
      ></path>
    </svg>
}