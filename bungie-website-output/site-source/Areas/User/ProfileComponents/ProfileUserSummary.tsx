// Created by larobinson, 2022
// Copyright Bungie, Inc.

import { ProfileDestinyMembershipDataStore } from "@Areas/User/AccountComponents/DataStores/ProfileDestinyMembershipDataStore";
import styles from "@Areas/User/Profile.module.scss";
import { BungieView } from "@Areas/User/ProfileComponents/BungieView";
import { DestinyView } from "@Areas/User/ProfileComponents/DestinyView";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { BungieMembershipType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Responses, User } from "@Platform";
import { IProfileParams } from "@Routes/Definitions/RouteParams";
import {
  DestinyAccountWrapper,
  IAccountFeatures,
} from "@UI/Destiny/DestinyAccountWrapper";
import { Icon } from "@UIKit/Controls/Icon";
import React, { useState } from "react";
import { useHistory, useParams } from "react-router";

interface ProfileUserSummaryProps {
  bungieNetUser: User.GeneralUser;
  isCrossSaved: boolean;
  membershipId: string;
  membershipType: BungieMembershipType;
  isSelf: boolean;
  destinyProfileResponse: Responses.DestinyProfileResponse;
}

export enum pageView {
  destiny = 0,
  bungie = 1,
}

export const ProfileUserSummary: React.FC<ProfileUserSummaryProps> = ({
  bungieNetUser,
  isCrossSaved,
  membershipId,
  membershipType,
  isSelf,
  destinyProfileResponse,
}) => {
  const params = useParams<IProfileParams>();
  const history = useHistory();
  const [showView, updateView] = useState<pageView>(pageView.destiny);
  const destinyMembership = useDataStore(ProfileDestinyMembershipDataStore);
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "loggedInUserClans",
  ]);
  const profileLoc = Localizer.Profile;
  const bungieTab = profileLoc.Bungie;
  const destinyTab = profileLoc.Destiny;

  if (!destinyMembership?.loaded) {
    return null;
  }

  return (
    <>
      {bungieNetUser && (
        <div className={styles.tabs}>
          <div
            onClick={() => updateView(pageView.destiny)}
            className={showView === pageView.destiny ? styles.selected : ``}
          >
            <Icon iconType={"bungle"} iconName={"logodestiny"} />
            {destinyTab}
          </div>
          <div
            onClick={() => updateView(pageView.bungie)}
            className={showView === pageView.bungie ? styles.selected : ``}
          >
            <Icon iconType={"bungle"} iconName={"logoseventhcolumn"} />
            {bungieTab}
          </div>
        </div>
      )}
      {destinyMembership?.membershipData?.destinyMemberships.length > 1 &&
        !isCrossSaved && (
          <div className={styles.platformSelector}>
            <DestinyAccountWrapper
              onPlatformChange={(value) =>
                ProfileDestinyMembershipDataStore.actions.updatePlatform(value)
              }
              membershipDataStore={ProfileDestinyMembershipDataStore}
            >
              {({ platformSelector }: IAccountFeatures) => (
                <div>
                  <div className={styles.flex}>{platformSelector}</div>
                </div>
              )}
            </DestinyAccountWrapper>
          </div>
        )}
      {showView === pageView.destiny && (
        <DestinyView
          coreSettings={globalState.coreSettings}
          destinyMembership={destinyMembership}
          destinyProfileResponse={destinyProfileResponse}
          loggedInUserClans={globalState.loggedInUserClans}
          membershipType={membershipType}
          membershipId={membershipId}
          isSelf={isSelf}
          updateView={updateView}
        />
      )}
      {bungieNetUser && showView === pageView.bungie && (
        <BungieView bungieNetUser={bungieNetUser} />
      )}
    </>
  );
};
