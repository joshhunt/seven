// Created by a-larobinson, 2019
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { RequiresAuth } from "@UI/User/RequiresAuth";
import { usePrevious } from "@Utilities/ReactUtils";
import { UserUtils } from "@Utilities/UserUtils";
import React, { useEffect } from "react";
import { useParams } from "react-router";
import { CodesDataStore } from "../CodesDataStore";
import { CodesHistoryForm } from "./CodesHistoryForm";

interface ICodesHistoryRouteParams {
  membershipId: string;
}

/**
 * CodesHistory - Replace this description
 *  *
 * @returns
 */
export const CodesHistory: React.FC = () => {
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "responsive",
    "crossSavePairingStatus",
  ]);
  const prevGlobalState = usePrevious(globalState);
  const params = useParams<ICodesHistoryRouteParams>();

  useEffect(() => {
    if (UserUtils.isAuthenticated(globalState)) {
      CodesDataStore.initialize(
        !!globalState.crossSavePairingStatus?.primaryMembershipId
      );
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

      <RequiresAuth>
        <CodesHistoryForm membershipId={params?.membershipId} />
      </RequiresAuth>
    </React.Fragment>
  );
};
