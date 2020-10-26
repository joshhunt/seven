// Created by atseng, 2020
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./RewardsBanner.module.scss";
import { RouteHelper } from "@Routes/RouteHelper";
import { Localizer } from "@Global/Localizer";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { GridCol, Grid } from "@UI/UIKit/Layout/Grid/Grid";

// Required props
interface IRewardsBannerProps {
  membershipId: string;
  emailVerified: boolean;
}

// Default props - these will have values set in RewardsBanner.defaultProps
interface DefaultProps {}

type Props = IRewardsBannerProps & DefaultProps;

interface IRewardsBannerState {}

/**
 * RewardsBanner - Bungie Rewards Banner used in the Registration Pages
 *  *
 * @param {IRewardsBannerProps} props
 * @returns
 */
export class RewardsBanner extends React.Component<Props, IRewardsBannerState> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  public static defaultProps: DefaultProps = {};

  public render() {
    const bungieRewards = Localizer.Registrationbenefits.BungieRewards;
    const bungieRewardsDesc =
      Localizer.Registrationbenefits.ThankYouForRegistering;
    const verifiedEmailRequired =
      Localizer.Registrationbenefits.VerifiedEmailRequired;
    const viewAllRewards = Localizer.Registrationbenefits.ViewAllRewards;

    return (
      <Grid>
        <GridCol cols={12}>
          <div className={styles.bungieRewardsBanner}>
            <strong>{bungieRewards}</strong>
            <p>{bungieRewardsDesc}</p>
            <div className={styles.buttons}>
              {!this.props.emailVerified && (
                <Button
                  buttonType={"gold"}
                  url={RouteHelper.ResendEmailVerification(
                    this.props.membershipId
                  )}
                  disabled={true}
                >
                  {verifiedEmailRequired}
                </Button>
              )}
              <Button buttonType={"gold"} url={RouteHelper.Rewards()}>
                {viewAllRewards}
              </Button>
            </div>
          </div>
        </GridCol>
      </Grid>
    );
  }
}
