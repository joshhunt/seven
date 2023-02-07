import classNames from "classnames";
import * as React from "react";
import styles from "./Icon.module.scss";
import { Spinner } from "./Spinner";

export type iconTypeType = "material" | "fa" | "bungle";

export interface IIconProps extends React.DOMAttributes<HTMLDivElement> {
  /** If true, icon will spin */
  spin?: boolean;
  /** Name of icon (from relevant icon library).
   * fa: https://fontawesome.com/v4.7.0/icons/
   * material: https://material.io/tools/icons/?style=baseline
   * */
  iconName: string;
  /** Icon library to use */
  iconType: iconTypeType;
  /** Additional styles */
  style?: React.CSSProperties;
  /** Additional className */
  className?: string;
}

export class Icon extends React.Component<IIconProps> {
  public render() {
    const { spin, iconName, iconType, className, ...rest } = this.props;

    let iconClass = "";
    let children = null;

    switch (iconType) {
      case "fa":
        iconClass = `fa fa-${iconName}`;
        break;

      case "material":
        iconClass = `material-icons`;
        children = iconName;
        break;

      case "bungle":
        iconClass = `icon-${iconName}`;
    }

    const iconClassFull = classNames(iconClass, { [styles.isSpinning]: spin });

    const classes = classNames("icon", styles.icon, className);

    return (
      <span className={classes} {...rest}>
        <i className={iconClassFull}>{children}</i>
      </span>
    );
  }
}
