// Created by larobinson, 2022
// Copyright Bungie, Inc.

import GameHistory from "@Areas/User/GameHistory/GameHistory";
import Profile from "@Areas/User/Profile";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { RouteHelper } from "@Routes/RouteHelper";
import { IProfileParams } from "@Routes/Definitions/RouteParams";
import { Anchor } from "@UI/Navigation/Anchor";
import { Icon } from "@UIKit/Controls/Icon";
import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import styles from "../Profile.module.scss";

const GameHistoryArea: React.FC = () => {
  const params = useParams<IProfileParams>();
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const history = useHistory();

  return (
    <Profile>
      <div className={styles.fullWidthElement}>
        <div className={styles.destinySubscreenBreadcrumb}>
          <Anchor url={RouteHelper.TargetProfile(params.mid, 254)}>
            {Localizer.profile.destiny}
          </Anchor>
          <p>{Localizer.Profile.gamehistory}</p>
        </div>
        <GameHistory
          initialUserPair={{
            membershipType: Number(params.mtype),
            membershipId: params.mid,
          }}
        />
      </div>
    </Profile>
  );
};

export default GameHistoryArea;
