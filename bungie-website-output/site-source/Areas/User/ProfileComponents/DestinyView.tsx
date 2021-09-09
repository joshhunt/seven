// Created by atseng, 2021
// Copyright Bungie, Inc.

import styles from "@Areas/User/Profile.module.scss";
import { Clan } from "@Areas/User/ProfileComponents/Clan";
import Collections from "@Areas/User/ProfileComponents/Collections";
import ProfileCharacterSelector from "@Areas/User/ProfileComponents/ProfileCharacterSelector";
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
  } = props;

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
      <Clan
        mType={membershipType}
        mId={membershipId}
        loggedInUserClans={loggedInUserClans}
        coreSettings={coreSettings}
        isSelf={isSelf}
        destinyMembership={destinyMembership}
      />
      <Season
        seasonHash={coreSettings.destiny2CoreSettings.currentSeasonHash}
        profileResponse={destinyProfileResponse}
        characterComponent={
          destinyMembership?.selectedCharacter ??
          destinyMembership.characters[0]
        }
      />
      <div className={styles.triumphsCollections}>
        <Triumphs
          profileResponse={destinyProfileResponse}
          coreSettings={coreSettings}
          membershipId={membershipId}
          membershipType={membershipType}
        />
        {destinyMembership?.selectedCharacter && (
          <Collections
            profileResponse={destinyProfileResponse}
            coreSettings={coreSettings}
            characterId={destinyMembership.selectedCharacter.characterId}
            membershipId={membershipId}
            membershipType={membershipType}
          />
        )}
      </div>
      <ProfileGameHistoryLink />
    </>
  );
};
