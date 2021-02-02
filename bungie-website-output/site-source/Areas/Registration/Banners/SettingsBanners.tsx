// Created by atseng, 2020
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./SettingsBanners.module.scss";
import { Grid, GridCol } from "@UI/UIKit/Layout/Grid/Grid";
import { Localizer } from "@Global/Localization/Localizer";
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

// Default props - these will have values set in SettingsBanners.defaultProps
interface DefaultProps {}

type Props = ISettingsBannersProps & DefaultProps;

interface ISettingsBannersState {
  emailUsageLoaded: boolean;
  optedInUR: boolean;
  optedInURChecked: boolean;
  optedInURClicked: boolean;
  optedInTravel: boolean;
  optedInTravelChecked: boolean;
  optedInTravelClicked: boolean;
  optedInRewards: boolean;
  optedInRewardsChecked: boolean;
  optedInRewardsClicked: boolean;
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
      optedInUR: false,
      optedInURChecked: false,
      optedInURClicked: false,
      optedInTravel: false,
      optedInTravelChecked: false,
      optedInTravelClicked: false,
      optedInRewards: false,
      optedInRewardsChecked: false,
      optedInRewardsClicked: false,
    };
  }

  public componentDidUpdate(
    prevProps: Props,
    prevState: ISettingsBannersState
  ) {
    if (
      (this.state.optedInRewardsClicked &&
        prevState.optedInRewards !== this.state.optedInRewards) ||
      (this.state.optedInTravelClicked &&
        prevState.optedInTravel !== this.state.optedInTravel) ||
      (this.state.optedInURClicked &&
        prevState.optedInUR !== this.state.optedInUR)
    ) {
      this.updateUserSettings();
    }

    if (!this.state.emailUsageLoaded) {
      this.setEmailUsage();
    }
  }

  public static defaultProps: DefaultProps = {};

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

  private URBanner() {
    const signUpForUserResearch =
      Localizer.Registrationbenefits.SignUpForBungieUserResearch;
    const allowUserResearchEmails =
      Localizer.Registrationbenefits.IAllowBungieToEmailMeUR;
    const allowUserResearchTravelEmails =
      Localizer.Registrationbenefits.IAmInterestedInUserResearch;
    const learnMoreButton = Localizer.Registrationbenefits.LearnMore;

    return (
      <div className={classNames(styles.optInUR, styles.postValidationBanner)}>
        <span className={styles.URIcon} />
        <div className={styles.text}>
          <strong>{signUpForUserResearch}</strong>
          <Checkbox
            onClick={this.handleURToggleOptIn}
            onChange={this.checkUROptedInStatus}
            checked={this.state.optedInURChecked}
            label={allowUserResearchEmails}
          />
          <Checkbox
            disabled={!this.state.optedInUR}
            onClick={this.handleURTravelToggleOptIn}
            onChange={this.checkURTravelOptedInStatus}
            checked={this.state.optedInTravelChecked}
            label={allowUserResearchTravelEmails}
          />
        </div>
        <div className={styles.buttons}>
          <Button buttonType={"gold"} url={RouteHelper.PlayTests()}>
            {learnMoreButton}
          </Button>
        </div>
      </div>
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
            onClick={this.handleRewardsToggleOptIn}
            onChange={this.checkRewardsOptedInStatus}
            checked={this.state.optedInRewardsChecked}
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

  private readonly handleRewardsToggleOptIn = () => {
    const newOptIn = !this.state.optedInRewards;

    this.setState({
      optedInRewardsClicked: true,
      optedInRewards: newOptIn,
    });
  };

  private readonly handleURToggleOptIn = () => {
    const newOptIn = !this.state.optedInUR;

    this.setState({
      optedInURClicked: true,
      optedInUR: newOptIn,
    });
  };

  private readonly handleURTravelToggleOptIn = () => {
    const newOptIn = !this.state.optedInTravel;

    this.setState({
      optedInTravelClicked: true,
      optedInTravel: newOptIn,
    });
  };

  private readonly checkRewardsOptedInStatus = () => {
    return this.state.optedInRewards;
  };

  private readonly checkUROptedInStatus = () => {
    return this.state.optedInUR;
  };

  private readonly checkURTravelOptedInStatus = () => {
    return this.state.optedInUR;
  };

  private setEmailUsage() {
    this.setState({ emailUsageLoaded: true });

    const emailUsage = this.props.emailUsage;

    const optedInUR = (emailUsage & OptInFlags.PlayTests) !== 0;
    const optedInTravel = (emailUsage & OptInFlags.PlayTestsLocal) !== 0;

    const optedInRewards = (emailUsage & this.aggregateRewardsFlags) !== 0;

    this.setState({
      optedInUR: optedInUR,
      optedInURChecked: optedInUR,
      optedInTravel: optedInTravel,
      optedInTravelChecked: optedInTravel,
      optedInRewards: optedInRewards,
      optedInRewardsChecked: optedInRewards,
    });
  }

  private updateUserSettings() {
    //reset the clicked state
    this.setState({
      optedInRewardsClicked: false,
      optedInURClicked: false,
      optedInTravelClicked: false,
    });

    const addedOptIns =
      this.state.optedInUR ||
      this.state.optedInTravel ||
      this.state.optedInRewards
        ? (
            (this.state.optedInUR ? OptInFlags.PlayTests : OptInFlags.None) |
            (this.state.optedInTravel
              ? OptInFlags.PlayTestsLocal
              : OptInFlags.None) |
            (this.state.optedInRewards
              ? this.aggregateRewardsFlags
              : OptInFlags.None)
          ).toString()
        : null;

    const removeOptIns =
      !this.state.optedInUR ||
      !this.state.optedInTravel ||
      !this.state.optedInRewards
        ? (
            (!this.state.optedInUR ? OptInFlags.PlayTests : OptInFlags.None) |
            (!this.state.optedInTravel
              ? OptInFlags.PlayTestsLocal
              : OptInFlags.None) |
            (!this.state.optedInRewards
              ? this.aggregateRewardsFlags
              : OptInFlags.None)
          ).toString()
        : null;

    const input: Contract.UserEditRequest = {
      membershipId: this.props.membershipId,
      addedOptIns: addedOptIns,
      removedOptIns: removeOptIns,
      displayName: null,
      uniqueName: null,
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
