import { Icon, IIconProps } from "@UI/UIKit/Controls/Icon";
import * as React from "react";
import styles from "../OneLineItem.module.scss";

export interface IIconCoinProps {
  iconImageUrl?: string;
  icon?: IIconProps;
}

export class IconCoin extends React.Component<IIconCoinProps> {
  public render() {
    let iconImageStyle: React.CSSProperties = null;
    if (this.props.iconImageUrl) {
      iconImageStyle = {
        backgroundImage: `url("${this.props.iconImageUrl}")`,
      };
    }

    if (this.props.icon) {
      return <Icon {...this.props.icon} />;
    }

    return (
      <div className={styles.iconCoin} style={iconImageStyle}>
        {this.props.children}
      </div>
    );
  }
}
