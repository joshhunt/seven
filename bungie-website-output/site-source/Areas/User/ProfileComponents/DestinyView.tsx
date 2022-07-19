// Created by atseng, 2021
// Copyright Bungie, Inc.

import { pageView } from "@Areas/User/Profile";
import styles from "@Areas/User/Profile.module.scss";
import { Clan } from "@Areas/User/ProfileComponents/Clan";
import { Localizer } from "@bungie/localization";
import Collections from "@Areas/User/ProfileComponents/Collections";
import ProfileCharacterSelector from "@Areas/User/ProfileComponents/ProfileCharacterSelector";
import { ProfileErrorBoundary } from "@Areas/User/ProfileComponents/ProfileErrorBoundary";
import Season from "@Areas/User/ProfileComponents/Season";
import Triumphs from "@Areas/User/ProfileComponents/Triumphs";
import { BungieMembershipType } from "@Enum";
import { DestinyMembershipDataStorePayload } from "@Global/DataStore/DestinyMembershipDataStore";
import { GroupsV2, Models, Responses } from "@Platform";
import React from "react";
import { ProfileGameHistoryLink } from "./ProfileGameHistoryLink";

interface DestinyViewProps {
  destinyMembership: DestinyMembershipDataStorePayload;
  destinyProfileResponse: Responses.DestinyProfileResponse;
  loggedInUserClans: GroupsV2.GetGroupsForMemberResponse;
  coreSettings: Models.CoreSettingsConfiguration;
  membershipType: BungieMembershipType;
  membershipId: string;
  isSelf: boolean;
  updateView: React.Dispatch<React.SetStateAction<pageView>>;
}

export const DestinyView: React.FC<DestinyViewProps> = (props) => {
  const {
    destinyMembership,
    loggedInUserClans,
    destinyProfileResponse,
    coreSettings,
    membershipType,
    membershipId,
    isSelf,
    updateView,
  } = props;

  const profileLoc = Localizer.Profile;

  return (
    <>
      {typeof destinyMembership.characters !== "undefined" && (
        <ProfileCharacterSelector
          membershipId={
            Object.values(destinyMembership.characters)[0]?.membershipId ?? ""
          }
          membershipType={
            Object.values(destinyMembership.characters)[0]?.membershipType ??
            BungieMembershipType.None
          }
          characters={destinyMembership.characters}
          selectedCharacterId={
            destinyMembership.selectedCharacter?.characterId ?? ""
          }
        />
      )}
      <ProfileErrorBoundary message={profileLoc.ClanLoadingError}>
        <Clan
          mType={membershipType}
          mId={membershipId}
          loggedInUserClans={loggedInUserClans}
          coreSettings={coreSettings}
          isSelf={isSelf}
          destinyMembership={destinyMembership}
        />
      </ProfileErrorBoundary>
      <ProfileErrorBoundary message={profileLoc.SeasonLoadingError}>
        <Season
          seasonHash={coreSettings.destiny2CoreSettings.currentSeasonHash}
          profileResponse={destinyProfileResponse}
          characterComponent={
            destinyMembership?.selectedCharacter ??
            destinyMembership.characters[0]
          }
        />
      </ProfileErrorBoundary>
      <div className={styles.triumphsCollections}>
        <ProfileErrorBoundary message={profileLoc.TriumphsLoadingError}>
          <Triumphs
            profileResponse={destinyProfileResponse}
            coreSettings={coreSettings}
            membershipId={membershipId}
            membershipType={membershipType}
          />
        </ProfileErrorBoundary>
        {destinyMembership?.selectedCharacter && (
          <ProfileErrorBoundary message={profileLoc.CollectionsLoadingError}>
            <Collections
              profileResponse={destinyProfileResponse}
              coreSettings={coreSettings}
              characterId={destinyMembership.selectedCharacter.characterId}
              membershipId={membershipId}
              membershipType={membershipType}
            />
          </ProfileErrorBoundary>
        )}
        <ProfileErrorBoundary message={profileLoc.GameHistoryLoadingError}>
          <ProfileGameHistoryLink updateView={updateView} />
        </ProfileErrorBoundary>
      </div>
    </>
  );
};
