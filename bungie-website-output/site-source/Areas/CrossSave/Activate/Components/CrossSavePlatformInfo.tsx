import { ICrossSaveFlowState } from "@Areas/CrossSave/Shared/CrossSaveFlowStateDataStore";
import { Localizer } from "@bungie/localization";
import { BungieMembershipType } from "@Enum";
import { GroupsV2, Platforms } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { SafelySetInnerHTML } from "@UI/Content/SafelySetInnerHTML";
import { Anchor } from "@UI/Navigation/Anchor";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import { ReactUtils } from "@Utilities/ReactUtils";
import * as React from "react";
import styles from "./CrossSavePlatformInfo.module.scss";
import { CrossSaveSilverBalance } from "./CrossSaveSilverBalance";

interface ICrossSavePlatformInfoProps {
  membershipType: BungieMembershipType;
  clan?: GroupsV2.GroupMembership;
  platformMembership: Platforms.BungiePlatformMembership;
  hideAccountInfo?: boolean;
  flowState?: ICrossSaveFlowState;
  showSilver?: boolean;
}

interface ICrossSavePlatformInfoState {}

/**
 * Shows platform information for cross save
 *  *
 * @param {ICrossSavePlatformInfoProps} props
 * @returns
 */
export class CrossSavePlatformInfo extends React.Component<
  ICrossSavePlatformInfoProps,
  ICrossSavePlatformInfoState
> {
  constructor(props: ICrossSavePlatformInfoProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const { membershipType, clan, platformMembership, flowState } = this.props;

    const displayName = platformMembership
      ? platformMembership.platformDisplayName
      : Localizer.Crosssave.NoAccountLinked;

    let clanLine: React.ReactNode | string = "";
    if (!platformMembership && !this.props.hideAccountInfo) {
      clanLine = Localizer.Format(Localizer.Crosssave.SignInMessage, {
        platformName: LocalizerUtils.getPlatformNameFromMembershipType(
          membershipType
        ),
      });
    }

    if (clan) {
      clanLine = clan.group.name;
    }

    return (
      <React.Fragment>
        {!this.props.hideAccountInfo && (
          <div className={styles.flexRow}>
            <div className={styles.accountInfo}>
              <div className={styles.displayName}>{displayName}</div>
              <div className={styles.clan}>{clanLine}</div>
            </div>
            {this.props.showSilver && (
              <div className={styles.silverContainer}>
                <CrossSaveSilverBalance
                  crossSaveActive={true}
                  membershipType={membershipType}
                  flowState={flowState}
                />
              </div>
            )}
          </div>
        )}
      </React.Fragment>
    );
  }
}
