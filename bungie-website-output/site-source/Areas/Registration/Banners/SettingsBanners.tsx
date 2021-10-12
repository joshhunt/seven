// Created by atseng, 2020
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./SettingsBanners.module.scss";
import { Grid, GridCol } from "@UI/UIKit/Layout/Grid/Grid";
import { Localizer } from "@bungie/localization";
import { Checkbox } from "@UI/UIKit/Forms/Checkbox";
import classNames from "classnames";
import { RouteHelper } from "@Routes/RouteHelper";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { OptInFlags } from "@Enum";
import { Icon } from "@UI/UIKit/Controls/Icon";
import { Contract, Platform } from "@Platform";
import { Toast } from "@UI/UIKit/Controls/Toast/Toast";
import { ConvertToPlatformError } from "@ApiIntermediary";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";

// Required props
interface ISettingsBannersProps {
  emailVerified: boolean;
  emailUsage: number;
  membershipId: string;
}

type Props = ISettingsBannersProps;

interface ISettingsBannersState {
  emailUsageLoaded: boolean;
  optedInRewards: boolean;
}

/**
 * SettingsBanners - Banners used on the Registration Pages that optin and update settings
 *  *
 * @param {ISettingsBannersProps} props
 * @returns
 */
export class SettingsBanners extends React.Component<
  Props,
  ISettingsBannersState
> {
  private readonly aggregateRewardsFlags =
    OptInFlags.Marketing |
    OptInFlags.Social |
    OptInFlags.Newsletter |
    OptInFlags.UserResearch;

  constructor(props: Props) {
    super(props);

    this.state = {
      emailUsageLoaded: false,
      optedInRewards: false,
    };
  }

  public componentDidUpdate(
    prevProps: Props,
    prevState: ISettingsBannersState
  ) {
    if (!this.state.emailUsageLoaded) {
      this.setEmailUsage();
    }
  }

  public render() {
    return (
      <React.Fragment>
        {this.props.emailVerified && this.state.emailUsageLoaded && (
          <React.Fragment>
            {!this.state.optedInRewards && this.rewardsSignUpBanner()}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }

  private rewardsSignUpBanner() {
    const signUpForRewards =
      Localizer.Registrationbenefits.SignUpForBungieRewards;
    const allowRewardsEmails =
      Localizer.Registrationbenefits.IAllowBungieToEmailMe;
    const learnMoreButton = Localizer.Registrationbenefits.LearnMore;

    return (
      <div
        className={classNames(styles.optInRewards, styles.postValidationBanner)}
      >
        <Icon iconName={"logoseventhcolumn"} iconType={"bungle"} />
        <div className={styles.text}>
          <strong>{signUpForRewards}</strong>
          <Checkbox
            checked={this.state.optedInRewards}
            onChecked={(checked: boolean) => {
              this.setState({ optedInRewards: checked });
              this.updateUser(checked);
            }}
            label={allowRewardsEmails}
          />
        </div>
        <div className={styles.buttons}>
          <Button buttonType={"gold"} url={RouteHelper.Rewards()}>
            {learnMoreButton}
          </Button>
        </div>
      </div>
    );
  }

  private setEmailUsage() {
    this.setState({ emailUsageLoaded: true });

    const emailUsage = this.props.emailUsage;

    const optedInRewards = (emailUsage & this.aggregateRewardsFlags) !== 0;

    this.setState({
      optedInRewards: optedInRewards,
    });
  }

  private updateUser(optedInRewardsChecked: boolean) {
    // Since this is in initial registration, we can assume that this user does not have any values set for these preferences
    const addedOptIns = optedInRewardsChecked
      ? this.aggregateRewardsFlags
      : OptInFlags.None;
    const removeOptIns = !optedInRewardsChecked
      ? this.aggregateRewardsFlags
      : OptInFlags.None;

    const input: Contract.UserEditRequest = {
      membershipId: this.props?.membershipId,
      addedOptIns: addedOptIns.toString(),
      removedOptIns: removeOptIns.toString(),
      displayName: null,
      about: null,
      locale: null,
      emailAddress: null,
      statusText: null,
    };

    Platform.UserService.UpdateUser(input)
      .then(() => {
        Toast.show(Localizer.Userresearch.SettingsHaveChanged, {
          position: "br",
        });
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e));
  }
}
