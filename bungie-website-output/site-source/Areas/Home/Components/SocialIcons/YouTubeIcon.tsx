import React, { FC } from "react";
import SvgWrapper from "./SvgWrapper";

interface IconProps {
  title?: string;
}

const YoutubeIcon: FC<IconProps> = ({ title, ...rest }) => (
  <SvgWrapper title={title} height={39} width={39} {...rest}>
    <path
      fill="#818282"
      d="M36.748 9.356a4.494 4.494 0 0 0-3.136-3.11C30.804 5.5 19.517 5.5 19.517 5.5s-11.266-.018-14.103.746a4.493 4.493 0 0 0-3.13 3.11 46.21 46.21 0 0 0-.784 8.661 46.834 46.834 0 0 0 .785 8.62 4.512 4.512 0 0 0 3.13 3.117c2.807.746 14.102.746 14.102.746s11.26 0 14.095-.746a4.513 4.513 0 0 0 3.136-3.117 46.61 46.61 0 0 0 .751-8.62 46.565 46.565 0 0 0-.75-8.661ZM15.913 23.371V12.64l9.395 5.376-9.395 5.354Z"
    />
  </SvgWrapper>
);

export default YoutubeIcon;
