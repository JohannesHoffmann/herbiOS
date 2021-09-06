import React from "react";
import useThemeColor from "../../utils/useThemeColor";
import { IconProps } from "./IIcons";

export default function IconSunrise(props: IconProps) {
    const color = useThemeColor(props.color);
    const secondary = useThemeColor(props.secondary);
    const { height } = props;
    const width = props.width ? props.width : 44;

    return <svg width={width} height={height} viewBox="0 0 42 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0)">
        <path
          fill={color}
          d="M26.092 3.073c.19-.305.77-1.603.83-1.68.059-.076.415-1.221.77-1.374.356-.152.356.637.237 1.146-.257.712-.877 2.244-1.304 2.672-.533.534-.77-.382-.533-.764zM3.646 18.888c-.362-.126-1.807-.39-1.902-.435-.096-.046-1.304-.092-1.596-.465-.291-.373.437-.632.957-.658.767.07 2.444.305 3.02.672.72.46-.026 1.042-.48.886zM31.363 6.65c.318-.214 1.398-1.208 1.492-1.257.094-.049.858-.986 1.332-.994.473-.009.241.73-.05 1.16-.52.57-1.716 1.768-2.355 2.007-.8.298-.817-.648-.42-.916zM6.843 11.721c-.308-.228-1.607-.912-1.685-.984-.077-.072-1.216-.478-1.383-.92-.166-.444.606-.473 1.11-.343.71.298 2.241 1.023 2.68 1.546.55.653-.336.986-.722.701zM20.838 9.429c-6.413 0-12.756 5.819-12.756 11.857 0 1.083.204 2.166.575 3.214H18l2.5-3 2.5 3h9.526a9.91 9.91 0 00.25-2.213c0-6.038-5.525-12.858-11.938-12.858z"
        ></path>
        <path
          stroke={secondary}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.169 11.041C16.205 9.771 18.555 9 20.914 9 27.406 9 33 15.835 33 21.887 33 27.94 27.406 33 20.914 33S8 26.936 8 20.884c0-1.853.602-3.685 1.624-5.336"
        ></path>
        <path
          fill={color}
          d="M10.09 3.049c.378-.209.997.304 1.26.586.472.51 1.455 1.109 1.573 1.435.435 1.201-1.101 1.108-1.574.456-.202-.28-1.731-2.217-1.259-2.477zM18.66.095c.432.016.566.837.579 1.246.023.736.38 1.841.253 2.21-.47 1.361-1.593.421-1.52-.448.03-.373.15-3.027.688-3.008zM38.415 21.599c.383.024 1.845-.109 1.95-.09.104.018 1.28-.261 1.661.02.38.281-.252.726-.746.89-.758.137-2.436.36-3.09.162-.815-.25-.253-1.011.225-.982zM41.114 11.905c.097.421-.662.763-1.053.882-.705.213-1.68.844-2.07.816-1.436-.1-.819-1.43.04-1.585.368-.066 2.962-.639 3.083-.113z"
        ></path>
      </g>
      <path
        stroke={secondary}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.5 24.5H18l2.5-3 2.5 3h13.5"
      ></path>
      <path
        stroke={secondary}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.5 27.5L33.5 27.5"
      ></path>
      <path
        stroke={secondary}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.5 30.5L29.5 30.5"
      ></path>
      <path
        stroke={secondary}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.5 33.5L33.5 33.5"
      ></path>
      <path
        stroke={secondary}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.5 27.5L14.5 27.5"
      ></path>
      <defs>
        <clipPath id="clip0">
          <path fill="#fff" d="M0 0H42V24H0z"></path>
        </clipPath>
      </defs>
    </svg>
    
}