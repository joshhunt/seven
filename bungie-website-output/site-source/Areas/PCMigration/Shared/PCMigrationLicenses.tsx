import React from "react";
import styles from "./PCMigrationModal.module.scss";
import * as Globals from "@Enum";
import { OneLineItem } from "@UI/UIKit/Companion/OneLineItem";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { IconCoin } from "@UI/UIKit/Companion/Coins/IconCoin";
import { IPCMigrationEntitlementDisplay } from "./PCMigrationModalStagePage";
import classNames from "classnames";
import { Localizer } from "@Global/Localizer";
import { Img } from "@Helpers";

interface IPCMigrationLicensesProps {
  versionsOwned: Globals.DestinyGameVersions;
}

export class PCMigrationLicenses extends React.Component<
  IPCMigrationLicensesProps
> {
  constructor(props) {
    super(props);
  }

  public render() {
    const licenseHeaderLabel = Localizer.Pcmigration.entitlements;
    const licenseHeaderSubtitleLabel =
      Localizer.Pcmigration.yourcharactersandsilver;
    const noLicenseHeaderSubtitleLabel = Localizer.Pcmigration.noLicenseFound;

    if (this.props.versionsOwned > 0) {
      return (
        <React.Fragment>
          <div
            className={classNames(styles.detailContainer, styles.licenseDetail)}
          >
            <h4 className="section-header">{licenseHeaderLabel}</h4>
            <p className={styles.subtitle}>{licenseHeaderSubtitleLabel}</p>
            <div className="destinyLicenses">
              {this.renderTheEntitlements(
                Globals.BungieMembershipType.TigerBlizzard
              )}
            </div>
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <div
            className={classNames(styles.detailContainer, styles.licenseDetail)}
          >
            <h4 className="section-header">{licenseHeaderLabel}</h4>
            <p className={styles.subtitle}>{noLicenseHeaderSubtitleLabel}</p>
          </div>
        </React.Fragment>
      );
    }
  }

  private renderTheEntitlements(
    membershipType: Globals.BungieMembershipType
  ): JSX.Element {
    return (
      <React.Fragment>
        {this.getEntitlements(membershipType).map((e) => (
          <OneLineItem
            itemTitle={e.title}
            key={e.ownedVersion}
            size={BasicSize.Small}
            icon={
              <IconCoin
                iconImageUrl={this.getEntitlementIconPath(e.iconPath)}
              />
            }
          />
        ))}
      </React.Fragment>
    );
  }

  private getEntitlementIconPath(iconPath: string) {
    const missingIconPath = "/img/theme/destiny/icons/missing_emblem.jpg";

    return iconPath !== "" ? iconPath : missingIconPath;
  }

  private getEntitlements(
    membershipType: Globals.BungieMembershipType
  ): IPCMigrationEntitlementDisplay[] {
    const entitlements = this.props.versionsOwned;

    const entitlementDisplays: IPCMigrationEntitlementDisplay[] = [];

    const iconPath = Img("destiny/icons/pcmigration/");

    if (entitlements & Globals.DestinyGameVersions.Destiny2) {
      entitlementDisplays.push({
        iconPath: `${iconPath}destiny2.png`,
        membershipType: membershipType,
        ownedVersion: Globals.DestinyGameVersions.Destiny2,
        title: Localizer.Pcmigration.destiny2license,
      });
    }

    if (entitlements & Globals.DestinyGameVersions.DLC1) {
      entitlementDisplays.push({
        iconPath: `${iconPath}curseofosiris.png`,
        membershipType: membershipType,
        ownedVersion: Globals.DestinyGameVersions.DLC1,
        title: Localizer.Pcmigration.destiny2dlc1license,
      });
    }

    if (entitlements & Globals.DestinyGameVersions.DLC2) {
      entitlementDisplays.push({
        iconPath: `${iconPath}warmind.png`,
        membershipType: membershipType,
        ownedVersion: Globals.DestinyGameVersions.DLC2,
        title: Localizer.Pcmigration.destiny2dlc2license,
      });
    }

    if (entitlements & Globals.DestinyGameVersions.Forsaken) {
      entitlementDisplays.push({
        iconPath: `${iconPath}forsaken.png`,
        membershipType: membershipType,
        ownedVersion: Globals.DestinyGameVersions.Forsaken,
        title: Localizer.Pcmigration.destiny2forsakenlicense,
      });
    }

    if (entitlements & Globals.DestinyGameVersions.YearTwoAnnualPass) {
      entitlementDisplays.push({
        iconPath: `${iconPath}annualpass.png`,
        membershipType: membershipType,
        ownedVersion: Globals.DestinyGameVersions.YearTwoAnnualPass,
        title: Localizer.Pcmigration.destiny2year2annualpass,
      });
    }

    return entitlementDisplays;
  }
}
