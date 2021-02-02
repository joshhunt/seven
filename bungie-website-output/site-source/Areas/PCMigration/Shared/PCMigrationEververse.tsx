import React from "react";
import styles from "./PCMigrationModal.module.scss";
import { IconCoin } from "@UI/UIKit/Companion/Coins/IconCoin";
import { OneLineItem } from "@UI/UIKit/Companion/OneLineItem";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import classNames from "classnames";
import { Localizer } from "@Global/Localization/Localizer";
import { Img } from "@Helpers";

interface IPCMigrationEververseProps {
  silverBalance: number;
  dust: number;
}

export class PCMigrationEververse extends React.Component<
  IPCMigrationEververseProps
> {
  constructor(props) {
    super(props);
  }

  public render() {
    const eververseHeaderLabel = Localizer.Pcmigration.eververse;
    const eververseSubtitleLabel = Localizer.Pcmigration.alleverversepurchases;
    const eververseSilverLabel = Localizer.Pcmigration.silver;

    return (
      <React.Fragment>
        <div
          className={classNames(styles.detailContainer, styles.eververseDetail)}
        >
          <h4 className="section-header">{eververseHeaderLabel}</h4>
          <p className={styles.subtitle}>{eververseSubtitleLabel}</p>
          <div className="destinyEververse">
            <OneLineItem
              itemTitle={eververseSilverLabel}
              size={BasicSize.Small}
              flair={this.props.silverBalance}
              icon={
                <IconCoin
                  iconImageUrl={Img("/destiny/icons/pcmigration/silver.png")}
                />
              }
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
