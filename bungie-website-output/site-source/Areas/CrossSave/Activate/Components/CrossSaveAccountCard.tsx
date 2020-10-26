// Created by jlauer, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import { Characters } from "@Platform";
import classNames from "classnames";
import styles from "./CrossSaveAccountCard.module.scss";
import { CrossSavePlatformInfo } from "./CrossSavePlatformInfo";
import { DestinyCharacterCard } from "@UI/Destiny/DestinyCharacterCard";
import {
  SpinnerContainer,
  SpinnerDisplayMode,
} from "@UI/UIKit/Controls/Spinner";
import { ICrossSaveFlowState } from "@Areas/CrossSave/Shared/CrossSaveFlowStateDataStore";
import { CrossSaveUtils } from "@Areas/CrossSave/Shared/CrossSaveUtils";
import { CrossSaveCard } from "@Areas/CrossSave/Shared/CrossSaveCard";
import { Localizer } from "@Global/Localizer";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import { BungieMembershipType } from "@Enum";

interface ICrossSaveAccountCardProps extends React.HTMLProps<HTMLDivElement> {
  flowState: ICrossSaveFlowState;
  membershipType: BungieMembershipType;
  /** If this prop exists, the card header will display headerOverride's content instead of the membership platform name and logo */
  headerOverride?: React.ReactNode;
}

interface DefaultProps {
  hideCharacters: boolean;
  hideAccountInfo: boolean;
  loading: boolean;
  aboveCharacters: React.ReactNode;
  showSilver: boolean;
  showCharacterOrigin: boolean;
  hideClan: boolean;
}

interface ICrossSaveAccountCardState {}

/**
 * CrossSaveAccountCard - Displays platform info, characters, and essential account info, with an area for extra stuff in the bottom (renders children)
 *  *
 * @param {ICrossSaveAccountCardProps} props
 * @returns
 */
export class CrossSaveAccountCard extends React.Component<
  ICrossSaveAccountCardProps & DefaultProps,
  ICrossSaveAccountCardState
> {
  constructor(props: ICrossSaveAccountCardProps & DefaultProps) {
    super(props);

    this.state = {};
  }

  public static defaultProps: DefaultProps = {
    hideCharacters: false,
    hideAccountInfo: false,
    loading: false,
    aboveCharacters: null,
    showSilver: false,
    showCharacterOrigin: false,
    hideClan: false,
  };

  public render() {
    const {
      children,
      className,
      loading,
      flowState,
      aboveCharacters,
      membershipType,
      hideClan,
      hideCharacters,
      hideAccountInfo,
      headerOverride,
      ref,
      showCharacterOrigin,
      showSilver,
      ...rest
    } = this.props;

    const definitions = flowState.definitions;
    const flowStateForMembership = CrossSaveUtils.getFlowStateInfoForMembership(
      flowState,
      membershipType
    );

    const {
      profileResponse,
      platformMembership,
      clan,
    } = flowStateForMembership;

    const classes = classNames(className, styles.accountCard);

    let characterKvps: [string, Characters.DestinyCharacterComponent][] = [];
    if (
      profileResponse &&
      profileResponse.characters &&
      profileResponse.characters.data
    ) {
      characterKvps = Object.entries(profileResponse.characters.data);
    }

    const clanOrHidden = hideClan ? null : clan;
    const platformName = membershipType
      ? LocalizerUtils.getPlatformNameFromMembershipType(membershipType)
      : "";

    return (
      <CrossSaveCard
        membershipType={membershipType}
        className={classes}
        {...rest}
        headerOverride={headerOverride}
      >
        <SpinnerContainer loading={loading} mode={SpinnerDisplayMode.cover} />
        <CrossSavePlatformInfo
          membershipType={membershipType}
          clan={clanOrHidden}
          hideAccountInfo={hideAccountInfo}
          platformMembership={platformMembership}
          showSilver={showSilver}
          flowState={flowState}
        />
        {aboveCharacters}
        {platformMembership && !hideCharacters && (
          <React.Fragment>
            <div className={styles.characters}>
              {characterKvps.map((kvp) => (
                <DestinyCharacterCard
                  className={styles.characterItem}
                  key={kvp[0]}
                  character={kvp[1]}
                  definitions={definitions}
                />
              ))}
              {characterKvps.length === 0 && (
                <div className={styles.noCharacters}>
                  {Localizer.Format(Localizer.Crosssave.NoCharacters, {
                    platform: platformName,
                  })}
                </div>
              )}
              {showCharacterOrigin && characterKvps.length > 0 && (
                <p className={styles.characterOrigin}>
                  {Localizer.Format(
                    Localizer.Crosssave.FromYourPlatformAccount,
                    { platform: platformName }
                  )}
                </p>
              )}
            </div>
          </React.Fragment>
        )}
        {children}
      </CrossSaveCard>
    );
  }
}
