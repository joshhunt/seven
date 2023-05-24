import React, { FC } from "react";
import SvgWrapper from "./SvgWrapper";

interface IconProps {
  title?: string;
}

const TwitchIcon: FC<IconProps> = ({ title, ...rest }) => (
  <SvgWrapper title={title} height={39} width={39} {...rest}>
    <path
      fill="#818282"
      d="M3.957 1 1.5 7.612V34.04h9V39h4.914l4.902-4.96h7.363l9.821-9.91V1H3.957Zm3.271 3.302h27v18.17l-5.73 5.785h-9l-4.907 4.954v-4.954H7.227l.001-23.955Zm9 16.526H19.5v-9.914h-3.27v9.914Zm8.993 0h3.271v-9.914h-3.271v9.914Z"
    />
  </SvgWrapper>
);

export default TwitchIcon;
