import React, { FC } from "react";
import SvgWrapper from "./SvgWrapper";

interface IconProps {
  title?: string;
}

const InstagramIcon: FC<IconProps> = ({ title, ...rest }) => (
  <SvgWrapper title={title} height={39} width={39} {...rest}>
    <path
      fill="#818282"
      d="M19.5 0c-4.757 0-5.35.023-7.212.102-1.87.092-3.134.381-4.25.815a8.595 8.595 0 0 0-3.099 2.022 8.485 8.485 0 0 0-2.022 3.1c-.433 1.115-.723 2.38-.815 4.249C2.018 12.151 2 12.743 2 17.5s.023 5.35.102 7.212c.092 1.864.381 3.134.815 4.25a8.595 8.595 0 0 0 2.022 3.099 8.484 8.484 0 0 0 3.1 2.022c1.115.428 2.385.723 4.249.815 1.863.084 2.455.102 7.212.102s5.35-.023 7.212-.102c1.864-.092 3.134-.388 4.25-.815a8.595 8.595 0 0 0 3.099-2.022 8.44 8.44 0 0 0 2.022-3.1c.428-1.115.723-2.385.815-4.249.084-1.863.102-2.455.102-7.212s-.023-5.35-.102-7.212c-.092-1.864-.388-3.14-.815-4.25a8.595 8.595 0 0 0-2.022-3.099 8.44 8.44 0 0 0-3.1-2.022C29.847.483 28.577.194 26.713.102 24.849.018 24.257 0 19.5 0Zm0 3.15c4.672 0 5.23.023 7.076.102 1.703.08 2.631.364 3.247.605a5.457 5.457 0 0 1 2.017 1.31c.61.609.986 1.19 1.304 2.011.24.616.525 1.544.605 3.247.079 1.846.102 2.405.102 7.076 0 4.671-.023 5.23-.109 7.076-.091 1.704-.376 2.631-.615 3.247-.332.822-.702 1.396-1.312 2.017a5.522 5.522 0 0 1-2.017 1.304c-.608.24-1.55.525-3.259.605-1.856.079-2.403.102-7.087.102-4.684 0-5.23-.023-7.089-.108-1.703-.092-2.642-.377-3.258-.616-.832-.332-1.401-.701-2.012-1.312-.616-.616-1.007-1.202-1.31-2.017-.244-.608-.524-1.549-.615-3.259-.062-1.834-.092-2.403-.092-7.065 0-4.66.03-5.23.092-7.088.09-1.71.37-2.648.616-3.258.302-.833.694-1.401 1.31-2.017.608-.61 1.18-1.003 2.01-1.312.617-.24 1.533-.524 3.243-.61 1.856-.066 2.403-.09 7.08-.09l.073.05Zm0 5.368a8.98 8.98 0 0 0-8.984 8.984 8.98 8.98 0 0 0 8.984 8.984 8.98 8.98 0 0 0 8.984-8.984A8.98 8.98 0 0 0 19.5 8.518Zm0 14.818a5.83 5.83 0 0 1-5.834-5.834A5.83 5.83 0 0 1 19.5 11.67a5.83 5.83 0 0 1 5.834 5.833 5.83 5.83 0 0 1-5.834 5.834ZM30.946 8.159a2.104 2.104 0 0 1-2.103 2.102 2.1 2.1 0 1 1 0-4.199c1.156 0 2.103.941 2.103 2.097Z"
    />
  </SvgWrapper>
);

export default InstagramIcon;