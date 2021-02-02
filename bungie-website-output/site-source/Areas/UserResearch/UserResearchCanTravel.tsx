// Created by atseng, 2020
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./UserResearchCanTravel.module.scss";
import { RequiresAuth } from "@UI/User/RequiresAuth";
import { Platform, Contract } from "@Platform";
import { ConvertToPlatformError } from "@ApiIntermediary";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { OptInFlags, EmailValidationStatus } from "@Enum";
import { UserUtils } from "@Utilities/UserUtils";
import {
  withGlobalState,
  GlobalStateComponentProps,
} from "@Global/DataStore/GlobalStateDataStore";
import { FullPageLoadingBar } from "@UI/UIKit/Controls/FullPageLoadingBar";
import { RouteDefs } from "@Routes/RouteDefs";
import { RouteComponentProps } from "react-router-dom";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Localizer } from "@Global/Localization/Localizer";
import { SpecialBodyClasses, BodyClasses } from "@UI/HelmetUtils";

// Required props
interface IUserResearchCanTravelProps
  extends RouteComponentProps,
    GlobalStateComponentProps<"loggedInUser"> {}

// Default props - these will have values set in UserResearchCanTravel.defaultProps
interface DefaultProps {}

type Props = IUserResearchCanTravelProps & DefaultProps;

interface IUserResearchCanTravelState {
  optedIn: boolean;
  emailVerfied: boolean;
  travelSet: boolean;
  user: Contract.UserDetail;
}

/**
 * UserResearchCanTravel - This page automatically toggles on the users OptIns.PlaytestLocal
 *  *
 * @param {IUserResearchCanTravelProps} props
 * @returns
 */
class UserResearchCanTravel extends React.Component<
  Props,
  IUserResearchCanTravelState
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      optedIn: false,
      emailVerfied: false,
      travelSet: false,
      user: null,
    };
  }

  public async componentDidMount() {
    if (UserUtils.isAuthenticated(this.props.globalState)) {
      await this.loadUser();
    } else {
      //redirect to the playtest page
      this.redirect();
    }
  }

  public componentDidUpdate() {
    if (
      UserUtils.isAuthenticated(this.props.globalState) &&
      this.state.user !== null &&
      this.state.optedIn &&
      this.state.emailVerfied &&
      !this.state.travelSet
    ) {
      this.updateUserSettings();
    }
  }

  public static defaultProps: DefaultProps = {};

  public render() {
    const title = Localizer.Userresearch.SignUpForUserResearch;

    const desc = Localizer.Userresearch.WeWantFeedbackFromEveryone;

    return (
      <React.Fragment>
        <BungieHelmet
          title={title}
          image={"/7/ca/bungie/icons/logos/logo-UR-light.png"}
          description={desc}
        >
          <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
        </BungieHelmet>
        <FullPageLoadingBar />
      </React.Fragment>
    );
  }

  private updateUserSettings() {
    const addedOptIns = OptInFlags.PlayTestsLocal.toString();

    const input: Contract.UserEditRequest = {
      membershipId: this.state.user.user.membershipId,
      addedOptIns: addedOptIns,
      removedOptIns: null,
      displayName: null,
      uniqueName: null,
      about: null,
      locale: null,
      emailAddress: null,
      statusText: null,
    };

    Platform.UserService.UpdateUser(input)
      .then(() => {
        // redirect to the user research page
        this.redirect();
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e));
  }

  private async loadUser() {
    const user = await Platform.UserService.GetCurrentUser();

    const optedIn =
      (parseInt(user.emailUsage, 10) & OptInFlags.PlayTests) !== 0;
    const travelSet =
      (parseInt(user.emailUsage, 10) & OptInFlags.PlayTestsLocal) !== 0;
    const emailVerified = user.emailStatus === EmailValidationStatus.VALID;

    if (travelSet || !optedIn || !emailVerified) {
      //user is not opted in or email not verified, so redirect to the playtest page
      this.redirect();
    }

    this.setState({
      user: user,
      optedIn: optedIn,
      emailVerfied: emailVerified,
      travelSet: travelSet,
    });
  }

  private redirect() {
    const userResearchPagePath = RouteDefs.Areas.UserResearch.resolve("Index")
      .url;

    this.props.history.push(userResearchPagePath);
  }
}

export default withGlobalState(UserResearchCanTravel, ["loggedInUser"]);
