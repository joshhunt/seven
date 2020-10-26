// Created by larobinson, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import classNames from "classnames";
import styles from "./CrossSaveCard.module.scss";
import {
  SpinnerContainer,
  SpinnerDisplayMode,
} from "@UI/UIKit/Controls/Spinner";
import { BungieMembershipType } from "@Enum";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";

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

    return (
      <div className={classNames(className, styles.accountCard)} {...rest}>
        <SpinnerContainer loading={loading} mode={SpinnerDisplayMode.cover} />
        {withMembership ? (
          <div className={platformClasses}>
            <div className={styles.platformLogoIcon} title={platform}>
              &nbsp;
            </div>
            <div className={styles.platformLogoText} title={platform}>
              &nbsp;
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
