// Created by a-larobinson, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./CodesRedemption.module.scss";
import { Localizer } from "@Global/Localization/Localizer";
import {
  withGlobalState,
  GlobalStateComponentProps,
} from "@Global/DataStore/GlobalStateDataStore";
import { Grid, GridCol } from "@UI/UIKit/Layout/Grid/Grid";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { RequiresAuth } from "@UI/User/RequiresAuth";
import CodesRedemptionForm from "./CodesRedemptionForm";
import { DestinyHeader } from "@UI/Destiny/DestinyHeader";
import { UserUtils } from "@Utilities/UserUtils";
import { SpecialBodyClasses, BodyClasses } from "@UI/HelmetUtils";
import { CodesDataStore } from "../CodesDataStore";

interface ICodesRedemptionProps
  extends GlobalStateComponentProps<"loggedInUser"> {}

interface ICodesRedemptionState {}

/**
 * CodesRedemption - Replace this description
 *  *
 * @param {ICodesRedemptionProps} props
 * @returns
 */
class CodesRedemption extends React.Component<
  ICodesRedemptionProps,
  ICodesRedemptionState
> {
  constructor(props: ICodesRedemptionProps) {
    super(props);

    this.state = {};
  }

  public componentDidMount() {
    if (UserUtils.isAuthenticated(this.props.globalState)) {
      const userIsCrossSaved = !!this.props.globalState?.loggedInUser
        ?.crossSaveCredentialTypes?.length;

      CodesDataStore.initialize(userIsCrossSaved);
    }
  }

  public componentDidUpdate(prevProps: ICodesRedemptionProps) {
    const wasAuthed = UserUtils.isAuthenticated(prevProps.globalState);
    const isNowAuthed = UserUtils.isAuthenticated(this.props.globalState);

    // if user logs in then need to load everything
    if (!wasAuthed && isNowAuthed) {
      const userIsCrossSaved = !!this.props.globalState?.loggedInUser
        ?.crossSaveCredentialTypes?.length;

      CodesDataStore.initialize(userIsCrossSaved);
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
        <Grid isTextContainer={true}>
          <GridCol cols={12}>
            <RequiresAuth>
              <CodesRedemptionForm />
            </RequiresAuth>
          </GridCol>
        </Grid>
      </React.Fragment>
    );
  }
}

export default withGlobalState(CodesRedemption, ["loggedInUser"]);
