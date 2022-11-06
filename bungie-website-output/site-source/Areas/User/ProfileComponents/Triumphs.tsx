// Created by atseng, 2021
// Copyright Bungie, Inc.

import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { DestinyDefinitions } from "@Definitions";
import { BungieMembershipType } from "@Enum";
import { RouteHelper } from "@Routes/RouteHelper";
import { EnumUtils } from "@Utilities/EnumUtils";
import styles from "./miniblock.module.scss";
import { Models, Responses } from "@Platform";
import React from "react";
import classNames from "classnames";
import { Localizer } from "@bungie/localization";
import { Anchor } from "@UI/Navigation/Anchor";

interface TriumphsProps
  extends D2DatabaseComponentProps<
    "DestinyPresentationNodeDefinition" | "DestinyRecordDefinition"
  > {
  coreSettings: Models.CoreSettingsConfiguration;
  profileResponse: Responses.DestinyProfileResponse;
  membershipId: string;
  membershipType: BungieMembershipType;
}

const Triumphs: React.FC<TriumphsProps> = (props) => {
  const { coreSettings, profileResponse, definitions } = props;

  if (!profileResponse?.profileRecords?.data) {
    return null;
  }

  const profileLoc = Localizer.Profile;

  const sealsNodeHash =
    coreSettings.destiny2CoreSettings.activeSealsRootNodeHash;
  const sealDefs = definitions.DestinyPresentationNodeDefinition.get(
    sealsNodeHash
  );

  const sealsToDisplay: DestinyDefinitions.DestinyPresentationNodeDefinition[] = [];
  let count = 0;

  for (const presentationNode of sealDefs.children.presentationNodes) {
    const def = definitions.DestinyPresentationNodeDefinition.get(
      presentationNode.presentationNodeHash
    );

    if (typeof def.completionRecordHash !== "undefined" && count < 6) {
      const profileRecord =
        profileResponse.profileRecords.data.records[def.completionRecordHash];

      if (profileRecord?.objectives?.every((value) => value.complete)) {
        count++;
        sealsToDisplay.push(def);
      }
    }
  }

  const extraSeals = (
    displayedSeals: DestinyDefinitions.DestinyPresentationNodeDefinition[]
  ) => {
    const numberOfExtra = 6 - displayedSeals.length;
    const extras: JSX.Element[] = [];

    if (numberOfExtra > 0) {
      for (let i = 0; i < numberOfExtra; i++) {
        extras.push(
          <div className={styles.seal} key={i}>
            <img src={"/7/ca/destiny/icons/profile/noseal.png"} alt={""} />
          </div>
        );
      }

      return extras;
    } else {
      return null;
    }
  };

  return (
    <Anchor
      url={RouteHelper.NewTriumphs({
        mid: props.membershipId,
        mtype: EnumUtils.getNumberValue(
          props.membershipType,
          BungieMembershipType
        ).toString(),
      })}
      className={classNames(styles.mainContainer, styles.triumphsContainer)}
    >
      <h4>{profileLoc.Triumphs}</h4>
      <div className={styles.total}>
        <span>{profileLoc.TotalScore}</span>
        <span>{profileResponse.profileRecords.data.activeScore}</span>
      </div>
      <div className={styles.seals}>
        {sealsToDisplay.map((seal) => {
          return (
            <div className={styles.seal} key={seal.hash}>
              <img src={seal.displayProperties.icon} alt={""} />
            </div>
          );
        })}
        {extraSeals(sealsToDisplay)}
      </div>
    </Anchor>
  );
};

export default withDestinyDefinitions(Triumphs, {
  types: ["DestinyPresentationNodeDefinition", "DestinyRecordDefinition"],
});
