// Created by atseng, 2022
// Copyright Bungie, Inc.

import { ProfileDestinyMembershipDataStore } from "@Areas/User/AccountComponents/DataStores/ProfileDestinyMembershipDataStore";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { BNetAccountPrivacy, DestinyComponentType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Platform, Responses } from "@Platform";
import { AiOutlineQuestionCircle } from "@react-icons/all-files/ai/AiOutlineQuestionCircle";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import styles from "./DestinyCommendations.module.scss";
import profileStyles from "./miniblock.module.scss";

interface DestinyCommendationsProps
  extends D2DatabaseComponentProps<"DestinySocialCommendationNodeDefinition"> {}

const DestinyCommendations: React.FC<DestinyCommendationsProps> = (props) => {
  const destinyMembership = useDataStore(ProfileDestinyMembershipDataStore);
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const [profileResponse, setProfileResponse] = useState<
    Responses.DestinyProfileResponse
  >();

  const profileLoc = Localizer.Profile;

  const isSelf =
    UserUtils.isAuthenticated(globalState) &&
    destinyMembership?.membershipData?.bungieNetUser?.membershipId ===
      globalState.loggedInUser?.user?.membershipId;

  const getProfile = () => {
    Platform.Destiny2Service.GetProfile(
      destinyMembership?.selectedMembership?.membershipType,
      destinyMembership?.selectedMembership?.membershipId,
      [
        DestinyComponentType.Profiles,
        DestinyComponentType.SocialCommendations,
        DestinyComponentType.Records,
      ]
    ).then((result) => {
      setProfileResponse(result);
    });
  };

  const getPercentage = (hash: string) => {
    return Object.entries(
      socialCommendations.commendationNodePercentagesByHash
    ).find(([k, v]) => k === hash)?.[1];
  };

  useEffect(() => {
    if (destinyMembership?.selectedMembership) {
      getProfile();
    }
  }, [destinyMembership?.selectedMembership]);

  if (!profileResponse?.profileCommendations) {
    return null;
  }

  const socialCommendations = profileResponse?.profileCommendations?.data;
  const hideProgression =
    !isSelf &&
    (!socialCommendations?.commendationNodeScoresByHash ||
      !socialCommendations?.scoreDetailValues);

  const visibleCommendationNodes =
    socialCommendations?.commendationNodePercentagesByHash &&
    Object.keys(socialCommendations?.commendationNodePercentagesByHash)
      ?.map((k) => {
        const def = props.definitions.DestinySocialCommendationNodeDefinition.get(
          k
        );

        if (def?.displayProperties?.name) {
          return {
            key: k,
            value:
              socialCommendations?.commendationNodePercentagesByHash[
                parseInt(k)
              ],
            def: def,
          };
        }
      })
      .filter((n) => !!n);

  const visibleTotal = visibleCommendationNodes
    ?.map((v) => v?.value)
    ?.reduce((partialSum, v) => partialSum + v, 0);

  return (
    <div
      className={classNames(
        profileStyles.mainContainer,
        profileStyles.commendationsContainer,
        styles.commendationsContainer
      )}
    >
      <div className={styles.miniBlockHeader}>
        <h4>{profileLoc.Commendations}</h4>
        <Anchor url={RouteHelper.Help()} title={Localizer.Helptext.HelpArticle}>
          <AiOutlineQuestionCircle />
        </Anchor>
      </div>
      <div className={styles.dataContainer}>
        <div className={styles.totals}>
          <div className={styles.total}>
            {profileResponse?.profileCommendations?.data?.totalScore
              ? socialCommendations?.totalScore
              : 0}
          </div>
          {!hideProgression && (
            <p className={styles.instances}>
              <span>
                {Localizer.FormatReact(profileLoc.ReceivedReceived, {
                  received: socialCommendations?.scoreDetailValues?.[1],
                })}
              </span>
              <span>
                {Localizer.FormatReact(profileLoc.Givengiven, {
                  given: socialCommendations?.scoreDetailValues?.[0],
                })}
              </span>
            </p>
          )}
        </div>
        <div className={styles.bar}>
          {visibleCommendationNodes?.map((node) => {
            const className = node?.def.displayProperties.name.toLowerCase();

            const percentValue = getPercentage(node?.def?.hash?.toString());

            return (
              <div
                key={node?.key}
                className={styles[className]}
                style={{ width: `${percentValue}%` }}
              />
            );
          })}
        </div>
        <p className={styles.scoreHeader}>{profileLoc.ScoreBreakdown}</p>
        <div className={styles.score}>
          {visibleCommendationNodes?.map((node) => {
            const className = node.def.displayProperties.name.toLowerCase();

            const percentValue = getPercentage(node?.def?.hash?.toString());

            return (
              <div key={node.value} className={styles[className]}>
                <span className={styles.label}>
                  {node?.def?.displayProperties?.name}
                </span>
                <span
                  className={classNames(styles.number, styles[className])}
                >{`${percentValue}%`}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default withDestinyDefinitions(DestinyCommendations, {
  types: ["DestinySocialCommendationNodeDefinition"],
});
