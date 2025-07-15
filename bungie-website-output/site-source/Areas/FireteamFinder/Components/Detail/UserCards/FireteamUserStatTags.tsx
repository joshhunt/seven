// Created by atseng, 2022
// Copyright Bungie, Inc.

import { FireteamCommendations } from "@Areas/FireteamFinder/Components/Shared/FireteamCommendations";
import FireteamGuardianRank from "@Areas/FireteamFinder/Components/Shared/FireteamGuardianRank";
import { BungieMembershipType, DestinyComponentType } from "@Enum";
import { Platform, Responses } from "@Platform";
import React, { useEffect, useState } from "react";

interface FireteamUserStatTagsProps {
  mid: string;
  mtype: BungieMembershipType;
}

export const FireteamUserStatTags: React.FC<FireteamUserStatTagsProps> = (
  props
) => {
  const [profileResponse, setProfileResponse] = useState<
    Responses.DestinyProfileResponse
  >();

  const getProfileResponse = () => {
    Platform.Destiny2Service.GetProfile(props.mtype, props.mid, [
      DestinyComponentType.Characters,
      DestinyComponentType.SocialCommendations,
      DestinyComponentType.Profiles,
    ]).then((result) => {
      setProfileResponse(result);
    });
  };

  useEffect(() => {
    getProfileResponse();
  }, []);

  return (
    <>
      <FireteamGuardianRank
        highestRank={
          profileResponse?.profile?.data?.lifetimeHighestGuardianRank
        }
        currentRank={profileResponse?.profile?.data?.currentGuardianRank}
      />
      <FireteamCommendations
        totalScore={profileResponse?.profileCommendations?.data?.totalScore}
      />
    </>
  );
};
