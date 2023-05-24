import React, { FC } from "react";
import SvgWrapper from "./SvgWrapper";

interface IconProps {
  title?: string;
}

const FacebookIcon: FC<IconProps> = ({ title, ...rest }) => (
  <SvgWrapper title={title} height={39} width={39} {...rest}>
    <path
      fill="#818282"
      d="M37 17.608C37 7.881 29.161 0 19.5 0 9.832 0 2 7.88 2 17.608 2 26.395 8.397 33.681 16.766 35V22.7h-4.444v-5.09h4.444v-3.882c0-4.412 2.608-6.849 6.607-6.849 1.915 0 3.92.344 3.92.344v4.333h-2.21c-2.17 0-2.849 1.359-2.849 2.75v3.302h4.853l-.78 5.09h-4.073v12.3C30.596 33.68 37 26.395 37 17.609Z"
    />
  </SvgWrapper>
);

export default FacebookIcon;
