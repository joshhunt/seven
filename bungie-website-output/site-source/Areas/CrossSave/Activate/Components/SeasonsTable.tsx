// Created by atseng, 2022
// Copyright Bungie, Inc.

import { PlatformStatus } from "@Areas/CrossSave/Activate/Components/EntitlementsTable";
import styles from "@Areas/CrossSave/Activate/Components/EntitlementsTable.module.scss";
import { EntitlementsTableHeader } from "@Areas/CrossSave/Activate/Components/EntitlementsTableHeader";
import { ICrossSaveFlowState } from "@Areas/CrossSave/Shared/CrossSaveFlowStateDataStore";
import { CrossSaveUtils } from "@Areas/CrossSave/Shared/CrossSaveUtils";
import { Localizer } from "@bungie/localization/Localizer";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { BungieMembershipType, DestinyGameVersions } from "@Enum";
import { Seasons } from "@Platform";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { AiFillCheckCircle } from "@react-icons/all-files/ai/AiFillCheckCircle";
import { AiFillCloseCircle } from "@react-icons/all-files/ai/AiFillCloseCircle";
import { ImMinus } from "@react-icons/all-files/im/ImMinus";

interface SeasonsTableProps
  extends D2DatabaseComponentProps<
    "DestinySeasonDefinition" | "DestinySeasonPassDefinition"
  > {
  flowState: ICrossSaveFlowState;
}

const SeasonsTable: React.FC<SeasonsTableProps> = (props) => {
  if (!ConfigUtils.SystemStatus("CrossSaveEntitlementTables")) {
    return null;
  }

  const crosssaveLoc = Localizer.Crosssave;

  const entitlementsResponse = props.flowState.entitlements;
  const linkedProfiles = props.flowState.linkedDestinyProfiles;
  const pairableMembershipTypes = CrossSaveUtils.getPairableMembershipTypes(
    props.flowState
  );
  const isCrossSaved = !!props.flowState.isActive;
  const primaryMembershipType = props.flowState.primaryMembershipType;

  const [allSeasons, setAllSeasons] = useState<number[]>([]);

  const getAllSeasons = (seasonEntitlements: {
    [p: string]: Seasons.DestinySeasonEntitlements;
  }): number[] => {
    if (seasonEntitlements) {
      const allSeasonsUniqueSet = Object.values(seasonEntitlements).reduce(
        (result, { seasons }) => {
          const resultSet = [...seasons.map((s) => s.seasonHash)];

          resultSet.forEach((r) => result.add(r));

          return result;
        },
        new Set<number>()
      );

      return Array.from(allSeasonsUniqueSet).sort((a, b) => {
        const seasonANumber = props.definitions.DestinySeasonDefinition.get(a)
          .seasonNumber;
        const seasonBNumber = props.definitions.DestinySeasonDefinition.get(a)
          .seasonNumber;

        return seasonANumber - seasonBNumber;
      });
    }

    return [];
  };

  const stateOfSeason = (
    membershipType: BungieMembershipType,
    seasonHash: number
  ) => {
    const membershipId =
      linkedProfiles.profiles.find(
        (pro) => pro.membershipType === membershipType
      )?.membershipId ??
      linkedProfiles.profilesWithErrors.find(
        (pro) => pro.infoCard.membershipType === membershipType
      )?.infoCard.membershipId;

    const hasPlatform = !!membershipId;

    if (hasPlatform) {
      const primaryMembershipId =
        linkedProfiles.profiles.find(
          (pro) => pro.membershipType === primaryMembershipType
        )?.membershipId ??
        linkedProfiles.profilesWithErrors.find(
          (pro) => pro.infoCard.membershipType === primaryMembershipType
        )?.infoCard.membershipId;

      const platformSeasons =
        entitlementsResponse.profileSeasons[
          isCrossSaved ? primaryMembershipId : membershipId
        ];

      const hasEntitlement = !!platformSeasons?.seasons?.find(
        (s) => s.seasonHash === seasonHash && s.purchased
      );

      return hasEntitlement ? (
        <AiFillCheckCircle className={styles.check} />
      ) : (
        <AiFillCloseCircle className={styles.xmark} />
      );
    } else {
      return <ImMinus className={styles.minus} />;
    }
  };

  const entitlementRow = (gameVersion: DestinyGameVersions) => {
    const unlinked = CrossSaveUtils.getUnLinkedPairableMembershipTypes(
      props.flowState
    );

    return (
      <>
        {platformCell(primaryMembershipType, gameVersion, "active")}
        {pairableMembershipTypes
          .filter(
            (pm) => pm !== primaryMembershipType && !unlinked.includes(pm)
          )
          ?.map((lp) => platformCell(lp, gameVersion, "linked"))}
        {unlinked.map((un) => platformCell(un, gameVersion, "unlinked"))}
      </>
    );
  };

  const msCell = (
    seasonHash: number,
    platformStatus: PlatformStatus,
    key: string
  ) => {
    const platformStatusClassName = styles[platformStatus];

    return (
      <>
        <td className={classNames(styles.mscell, platformStatusClassName)}>
          {stateOfSeason(BungieMembershipType.TigerXbox, seasonHash)}
          {crosssaveLoc.Xbox}
          {stateOfSeason(BungieMembershipType.TigerXbox, seasonHash)}
          {crosssaveLoc.Pc}
        </td>
      </>
    );
  };

  const platformCell = (
    membershipType: BungieMembershipType,
    seasonHash: number,
    platformStatus: PlatformStatus
  ) => {
    const platformStatusClassName = styles[platformStatus];
    const key = `${EnumUtils.getNumberValue(
      membershipType,
      BungieMembershipType
    )}${seasonHash}`;

    if (membershipType === BungieMembershipType.TigerXbox) {
      return msCell(seasonHash, platformStatus, key);
    }

    return (
      <td className={platformStatusClassName} key={key}>
        {stateOfSeason(membershipType, seasonHash)}
      </td>
    );
  };

  useEffect(() => {
    setAllSeasons(getAllSeasons(entitlementsResponse?.profileSeasons));
  }, [entitlementsResponse]);

  if (allSeasons.length === 0 || !entitlementsResponse || !linkedProfiles) {
    return null;
  }

  return (
    <div className={styles.entitlementsTableWrapper}>
      <p className={styles.entitlementsHeader}>
        {Localizer.Crosssave.SeasonsHeaderUpper}
      </p>
      <p>{crosssaveLoc.ActiveAccountSeasonsWill}</p>
      <table className={styles.entitlementsTable}>
        <colgroup>
          <col />
          <col />
          <col />
          <col />
          <col />
        </colgroup>
        <EntitlementsTableHeader
          title={crosssaveLoc.SeasonsHeader}
          flowState={props.flowState}
        />
        {
          <tbody>
            {allSeasons.map((sHash) => {
              const seasonDef = props?.definitions?.DestinySeasonDefinition?.get(
                sHash
              ).displayProperties;

              if (!seasonDef) {
                return null;
              }

              return (
                <tr key={sHash}>
                  <th scope="row">{seasonDef.name}</th>
                  {entitlementRow(sHash)}
                </tr>
              );
            })}
          </tbody>
        }
      </table>
    </div>
  );
};

export default withDestinyDefinitions(SeasonsTable, {
  types: ["DestinySeasonDefinition", "DestinySeasonPassDefinition"],
});
