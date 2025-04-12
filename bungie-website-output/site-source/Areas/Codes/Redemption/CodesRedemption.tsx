// Created by a-larobinson, 2019
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { usePrevious } from "@Utilities/ReactUtils";
import React, { useEffect } from "react";
import styles from "./CodesRedemption.module.scss";
import { Localizer } from "@bungie/localization";
import {
  withGlobalState,
  GlobalStateComponentProps,
  GlobalStateDataStore,
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

/**
 * CodesRedemption - Replace this description
 *  *
 * @param {ICodesRedemptionProps} props
 * @returns
 */
export const CodesRedemption: React.FC<ICodesRedemptionProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const prevGlobalState = usePrevious(globalState);

  useEffect(() => {
    if (UserUtils.isAuthenticated(globalState)) {
      const userIsCrossSaved = !!globalState?.loggedInUser
        ?.crossSaveCredentialTypes?.length;

      CodesDataStore.initialize(userIsCrossSaved);
      GlobalStateDataStore?.actions?.refreshCurrentUser(true);
    }
  }, []);

  useEffect(() => {
    const wasAuthed = UserUtils.isAuthenticated(prevGlobalState);
    const isNowAuthed = UserUtils.isAuthenticated(globalState);

    // if user logs in then need to load everything
    if (!wasAuthed && isNowAuthed) {
      const userIsCrossSaved = !!globalState?.loggedInUser
        ?.crossSaveCredentialTypes?.length;

      CodesDataStore.initialize(userIsCrossSaved);
    }
  }, [globalState]);

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
};
