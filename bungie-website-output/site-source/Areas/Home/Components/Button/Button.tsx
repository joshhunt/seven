import React, { useMemo, FC, memo } from "react";
import classNames from "classnames";
import { Anchor } from "@UI/Navigation/Anchor";
import { IMultiSiteLink } from "@Routes/RouteHelper";
import styles from "./Button.module.scss";

interface Props {
  buttonColor?: "blue" | "grey" | "green";
  href?: IMultiSiteLink | string;
  label: any;
  analyticsId?: string;
}

const Button: FC<Props> = ({
  href,
  buttonColor,
  analyticsId,
  label,
  ...rest
}) => {
  const composedClassName = useMemo(
    () => classNames(styles.baseButton, styles[buttonColor || "blue"]),
    [buttonColor]
  );

  return href ? (
    <Anchor
      className={composedClassName}
      url={href}
      data-analytics-id={analyticsId}
      {...rest}
    >
      {label}
    </Anchor>
  ) : (
    <span className={composedClassName}>{label}</span>
  );
};

export default memo(Button);
