// Created by a-larobinson, 2019
// Copyright Bungie, Inc.

import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { RequiresAuth } from "@UI/User/RequiresAuth";
import { UserUtils } from "@Utilities/UserUtils";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { CodesDataStore } from "../CodesDataStore";
import { CodesHistoryForm } from "./CodesHistoryForm";

interface ICodesHistoryRouteParams {
  membershipId: string;
}

interface ICodesHistoryProps
  extends GlobalStateComponentProps<
      "loggedInUser" | "responsive" | "crossSavePairingStatus"
    >,
    RouteComponentProps<ICodesHistoryRouteParams> {}

interface ICodesHistoryState {}

/**
 * CodesHistory - Replace this description
 *  *
 * @param {ICodesHistoryProps} props
 * @returns
 */
class CodesHistory extends React.Component<
  ICodesHistoryProps,
  ICodesHistoryState
> {
  constructor(props: ICodesHistoryProps) {
    super(props);

    this.state = {};
  }

  public componentDidMount() {
    if (UserUtils.isAuthenticated(this.props.globalState)) {
      CodesDataStore.initialize(
        !!this.props.globalState.crossSavePairingStatus?.primaryMembershipId
      );
    }
  }

  public componentDidUpdate(prevProps: ICodesHistoryProps) {
    const wasAuthed = UserUtils.isAuthenticated(prevProps.globalState);
    const isNowAuthed = UserUtils.isAuthenticated(this.props.globalState);

    // if user logs in then need to load everything
    if (!wasAuthed && isNowAuthed) {
      CodesDataStore.initialize(
        !!this.props.globalState.crossSavePairingStatus?.primaryMembershipId
      );
    }
  }

  public render() {
    return (
      <React.Fragment>
        <BungieHelmet
          title={Localizer.CodeRedemption.CodeRedemption}
          image={"/7/ca/bungie/bgs/pcregister/engram.jpg"}
        >
          <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
        </BungieHelmet>

        <RequiresAuth>
          <CodesHistoryForm
            membershipId={this.props.match.params.membershipId}
          />
        </RequiresAuth>
      </React.Fragment>
    );
  }
}

const CodesHistoryOuter = withGlobalState(CodesHistory, [
  "loggedInUser",
  "responsive",
  "crossSavePairingStatus",
]);
export default withRouter(CodesHistoryOuter);
