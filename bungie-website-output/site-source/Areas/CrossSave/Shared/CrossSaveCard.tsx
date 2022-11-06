// Created by larobinson, 2019
// Copyright Bungie, Inc.

import { EnumUtils } from "@Utilities/EnumUtils";
import * as React from "react";
import classNames from "classnames";
import { Localizer } from "@bungie/localization";
import styles from "./CrossSaveCard.module.scss";
import {
  SpinnerContainer,
  SpinnerDisplayMode,
} from "@UI/UIKit/Controls/Spinner";
import { BungieMembershipType } from "@Enum";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import { TiVendorMicrosoft } from "react-icons/ti";

interface ICrossSaveCardProps extends React.HTMLProps<HTMLDivElement> {
  membershipType: BungieMembershipType;
}

interface DefaultProps {
  headerOverride: React.ReactNode;
  loading: boolean;
}

interface ICrossSaveCardState {}

/**
 * CrossSaveCard - Blank white card with header that shows membership platform
 * @param {ICrossSaveCardProps} props
 * @returns
 */

export class CrossSaveCard extends React.Component<
  ICrossSaveCardProps & DefaultProps,
  ICrossSaveCardState
> {
  constructor(props: ICrossSaveCardProps & DefaultProps) {
    super(props);

    this.state = {};
  }

  public static defaultProps: DefaultProps = {
    headerOverride: null,
    loading: false,
  };

  public render() {
    const {
      children,
      loading,
      className,
      membershipType,
      headerOverride,
      ...rest
    } = this.props;

    const withMembership = !headerOverride ? true : false;
    const platform =
      withMembership &&
      LocalizerUtils.getPlatformNameFromMembershipType(membershipType);
    const platformClasses =
      withMembership &&
      classNames(
        styles.platformInfo,
        styles[BungieMembershipType[membershipType]]
      );

    const platformIcon =
      platform === "Xbox" ? (
        <>
          /<TiVendorMicrosoft />
        </>
      ) : (
        <>&nbsp;</>
      );
    let platformName = EnumUtils.looseEquals(
      membershipType,
      BungieMembershipType.TigerXbox,
      BungieMembershipType
    ) ? (
      <>{Localizer.Crosssave.MicrosoftAccount}</>
    ) : (
      <>&nbsp;</>
    );
    if (
      EnumUtils.looseEquals(
        membershipType,
        BungieMembershipType.TigerEgs,
        BungieMembershipType
      )
    ) {
      platformName = <>{Localizer.Crosssave.EpicAccount}</>;
    }

    return (
      <div className={classNames(className, styles.accountCard)} {...rest}>
        <SpinnerContainer loading={loading} mode={SpinnerDisplayMode.cover} />
        {withMembership ? (
          <div className={platformClasses}>
            <div className={styles.platformLogoIcon} title={platform}>
              {platformIcon}
            </div>
            <div className={styles.platformLogoText} title={platform}>
              {platformName}
            </div>
          </div>
        ) : (
          <div>{headerOverride}</div>
        )}
        {children}
      </div>
    );
  }
}
