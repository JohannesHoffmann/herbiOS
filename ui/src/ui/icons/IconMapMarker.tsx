import React from "react";
import useThemeColor from "../../utils/useThemeColor";
import { IconProps } from "./IIcons";

export default function IconMapMarker(props: IconProps) {
    const color = useThemeColor(props.color);
    const secondary = useThemeColor(props.secondary);
    const { height } = props;
    const width = props.width ? props.width : 44;

    return <svg width={width} height={height} viewBox="0 0 85 98" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_dd)">
        <path
          fill={color}
          d="M74.338 43c0 14.789-9.35 27.305-22.233 31.5-2.994.975-6.18 13.5-9.482 13.5-3.302 0-6.487-12.525-9.481-13.5C20.258 70.305 10.909 57.789 10.909 43c0-18.225 14.199-33 31.714-33 17.516 0 31.715 14.775 31.715 33z"
        ></path>
      </g>
      <path
        fill={secondary}
        stroke={secondary}
        strokeLinecap="round"
        d="M57.245 31H28.908a3 3 0 00-2.932 2.365l-.81 3.744-2.411 11.141-.458 2.115A3 3 0 0025.229 54h36.053a3 3 0 002.91-2.268l1.653-6.575a3 3 0 00-1.462-3.359l-.376-.207a3 3 0 01-1.37-1.595l-2.575-7.028A3 3 0 0057.245 31z"
      ></path>
      <path
        fill={secondary}
        stroke={secondary}
        d="M33.85 54.925c-.612 2.258-3.138 3.668-4.909 3.149-1.77-.52-2.71-2.771-2.098-5.03.612-2.258 3.138-3.667 4.909-3.148 1.77.52 2.71 2.771 2.098 5.03zM59.238 55.5c-.611 2.258-3.138 3.667-4.908 3.148-1.77-.52-2.71-2.77-2.098-5.029.611-2.258 3.138-3.668 4.908-3.148 1.77.52 2.71 2.77 2.098 5.029z"
      ></path>
      <path
        stroke={color}
        d="M49.183 39.237l.763-3.031a1 1 0 01.97-.756h5.797a1 1 0 01.952 1.306l-.974 3.031a1 1 0 01-.952.694h-5.586a1 1 0 01-.97-1.244zM34.876 39.118l1.057-3a1 1 0 01.943-.668h7.974a1 1 0 01.976 1.219l-.673 3a1 1 0 01-.976.781H35.82a1 1 0 01-.943-1.332z"
      ></path>
      <path
        stroke={secondary}
        strokeLinecap="round"
        d="M31.372 40.7L21.32 40.7"
      ></path>
      <path stroke={secondary} strokeLinecap="round" d="M27.227 43L17.175 43"></path>
      <path
        fill={color}
        d="M29.12 41.275a.5.5 0 100-1v1zm0-1h-5.814v1h5.814v-1zM30.49 43.575a.5.5 0 100-1v1zm0-1h-7.736v1h7.736v-1z"
      ></path>
      <path
        stroke={secondary}
        strokeLinecap="round"
        d="M33.305 46.45L24.359 46.45"
      ></path>
      <defs>
        <filter
          id="filter0_dd"
          width="83.429"
          height="98"
          x="0.909"
          y="0"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          ></feColorMatrix>
          <feOffset dx="-2" dy="-2"></feOffset>
          <feGaussianBlur stdDeviation="4"></feGaussianBlur>
          <feColorMatrix values="0 0 0 0 0.831373 0 0 0 0 0.839216 0 0 0 0 0.835294 0 0 0 0.25 0"></feColorMatrix>
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          ></feBlend>
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          ></feColorMatrix>
          <feOffset dx="2" dy="2"></feOffset>
          <feGaussianBlur stdDeviation="4"></feGaussianBlur>
          <feComposite in2="hardAlpha" operator="out"></feComposite>
          <feColorMatrix values="0 0 0 0 0.831373 0 0 0 0 0.839216 0 0 0 0 0.835294 0 0 0 0.25 0"></feColorMatrix>
          <feBlend
            in2="effect1_dropShadow"
            result="effect2_dropShadow"
          ></feBlend>
          <feBlend
            in="SourceGraphic"
            in2="effect2_dropShadow"
            result="shape"
          ></feBlend>
        </filter>
      </defs>
    </svg>
}