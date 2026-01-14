import React, { FC } from "react";
import SvgWrapper from "./SvgWrapper";

interface IconProps {
  title?: string;
}

const XIcon: FC<IconProps> = ({ title, ...rest }) => (
  <SvgWrapper title={title} height={39} width={39} {...rest}>
    <path
      fill="#818282"
      d="M21.6395 16.3226L33.9245 2H31.0133L20.3463 14.4361L11.8265 2H2L14.8835 20.8056L2 35.825H4.91131L16.176 22.6921L25.1735 35.825H35L21.6388 16.3226H21.6395ZM17.652 20.9713L16.3467 19.0986L5.9603 4.19808H10.4319L18.8138 16.2233L20.1192 18.0959L31.0147 33.7269H26.5431L17.652 20.972V20.9713Z"
    />
  </SvgWrapper>
);

export default XIcon;
