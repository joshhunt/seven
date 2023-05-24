import React, { FC, ReactNode, memo } from "react";

interface IconProps {
  title?: string;
  children: ReactNode;
  height: number;
  width: number;
}

const SvgWrapper: FC<IconProps> = ({
  title,
  children,
  height,
  width,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    {...rest}
  >
    {title && <title>{title}</title>}
    {children}
  </svg>
);

export default memo(SvgWrapper);
