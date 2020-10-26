import * as React from "react";
import styles from "./CrossSavePlatformInfo.module.scss";
import { GroupsV2, Platforms } from "@Platform";
import { Localizer } from "@Global/Localizer";
import { CrossSaveSilverBalance } from "./CrossSaveSilverBalance";
import { ICrossSaveFlowState } from "@Areas/CrossSave/Shared/CrossSaveFlowStateDataStore";
import { BungieMembershipType } from "@Enum";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";

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

    let clanLine = "";
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
