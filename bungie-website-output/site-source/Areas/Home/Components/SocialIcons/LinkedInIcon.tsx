import React, { FC } from "react";
import SvgWrapper from "./SvgWrapper";

interface IconProps {
  title?: string;
}

const LinkedInIcon: FC<IconProps> = ({ title, ...rest }) => (
  <SvgWrapper title={title} height={39} width={39} {...rest}>
    <path
      fill="#818282"
      d="M31.112 29.122H26.23v-7.659c0-1.826-.038-4.173-2.552-4.173-2.545 0-2.933 1.981-2.933 4.038v7.793h-4.887V13.374h4.694v2.148h.063c.656-1.24 2.251-2.545 4.631-2.545 4.951 0 5.87 3.26 5.87 7.497v8.647l-.005.001Zm-20.775-17.9A2.835 2.835 0 0 1 7.5 8.378a2.84 2.84 0 1 1 2.837 2.842Zm2.449 17.9H7.888V13.375h4.898v15.747ZM33.562 1H5.434C4.09 1 3 2.063 3 3.379v28.242C3 32.937 4.09 34 5.434 34h28.123C34.899 34 36 32.937 36 31.621V3.379C36 2.063 34.899 1 33.557 1h.005Z"
    />
  </SvgWrapper>
);

export default LinkedInIcon;
