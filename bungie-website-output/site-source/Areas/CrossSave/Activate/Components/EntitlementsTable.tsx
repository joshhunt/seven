// Created by atseng, 2021
// Copyright Bungie, Inc.

import { EntitlementsTableHeader } from "@Areas/CrossSave/Activate/Components/EntitlementsTableHeader";
import { ICrossSaveFlowState } from "@Areas/CrossSave/Shared/CrossSaveFlowStateDataStore";
import { CrossSaveUtils } from "@Areas/CrossSave/Shared/CrossSaveUtils";
import { Localizer } from "@bungie/localization/Localizer";
import {
  BungieMarketplaceType,
  BungieMembershipType,
  DestinyGameVersions,
} from "@Enum";
import { SystemNames } from "@Global/SystemNames";
import { Responses } from "@Platform";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import classNames from "classnames";
import React from "react";
import { AiFillCheckCircle } from "@react-icons/all-files/ai/AiFillCheckCircle";
import { AiFillCloseCircle } from "@react-icons/all-files/ai/AiFillCloseCircle";
import { ImMinus } from "@react-icons/all-files/im/ImMinus";
import styles from "./EntitlementsTable.module.scss";

export type PlatformStatus = "active" | "linked" | "unlinked";

interface EntitlementsTableProps {
  flowState: ICrossSaveFlowState;
}

export const EntitlementsTable: React.FC<EntitlementsTableProps> = (props) => {
  if (!ConfigUtils.SystemStatus("CrossSaveEntitlementTables")) {
    return null;
  }

  const crosssaveLoc = Localizer.Crosssave;
  const entitlementsResponse = props.flowState.entitlements;
  const linkedProfiles = props.flowState.linkedDestinyProfiles;
  const pairableMembershipTypes = CrossSaveUtils.getPairableMembershipTypes(
    props.flowState
  );
  const activeMembershipType = props.flowState.primaryMembershipType;

  const stateOfEntitlement = (
    membershipType: BungieMembershipType,
    gameVersion: DestinyGameVersions,
    marketplace: BungieMarketplaceType = BungieMarketplaceType.Unknown
  ) => {
    const memberShipTypeString = BungieMembershipType[
      membershipType
    ] as EnumStrings<typeof BungieMembershipType>;
    const platformEntitlement =
      entitlementsResponse?.platformEntitlements[memberShipTypeString];

    const hasPlatformAccount =
      linkedProfiles?.profiles.some(
        (lp) => lp.membershipType === membershipType
      ) ||
      linkedProfiles?.profilesWithErrors.some(
        (lp) => lp.infoCard.membershipType === membershipType
      );

    if (hasPlatformAccount) {
      if (marketplace !== BungieMarketplaceType.Unknown) {
        const platformEntitlementByMarketplace =
          entitlementsResponse.platformEntitlementsByMarketplace[
            BungieMarketplaceType[marketplace] as EnumStrings<
              typeof BungieMarketplaceType
            >
          ];

        if (platformEntitlementByMarketplace) {
          return hasEntitlement(platformEntitlementByMarketplace, gameVersion);
        }
      }

      return hasEntitlement(platformEntitlement, gameVersion);
    } else {
      return <ImMinus className={styles.minus} />;
    }
  };

  const hasEntitlement = (
    entitlement: Responses.DestinyPlatformEntitlements,
    gameVersion: DestinyGameVersions
  ) => {
    const ownsEntitlement =
      entitlement && EnumUtils.hasFlag(gameVersion, entitlement.gameVersions);

    return ownsEntitlement ? (
      <AiFillCheckCircle className={styles.check} />
    ) : (
      <AiFillCloseCircle className={styles.xmark} />
    );
  };

  const entitlementRow = (gameVersion: DestinyGameVersions) => {
    const unlinked = CrossSaveUtils.getUnLinkedPairableMembershipTypes(
      props.flowState
    );

    return (
      <>
        {platformCell(activeMembershipType, gameVersion, "active")}
        {pairableMembershipTypes
          ?.filter(
            (pm) => pm !== activeMembershipType && !unlinked.includes(pm)
          )
          ?.map((lp, index) => platformCell(lp, gameVersion, "linked"))}
        {unlinked?.map((un) => platformCell(un, gameVersion, "unlinked"))}
      </>
    );
  };

  const msCell = (
    gameVersion: DestinyGameVersions,
    platformStatus: PlatformStatus,
    key: string
  ) => {
    const platformStatusClassName = styles[platformStatus];

    return (
      <>
        <td
          className={classNames(styles.mscell, platformStatusClassName)}
          key={key}
        >
          {stateOfEntitlement(BungieMembershipType.TigerXbox, gameVersion)}
          {crosssaveLoc.Xbox}
          {stateOfEntitlement(
            BungieMembershipType.TigerXbox,
            gameVersion,
            BungieMarketplaceType.PC_MicrosoftStore
          )}
          {crosssaveLoc.Pc}
        </td>
      </>
    );
  };

  const platformCell = (
    membershipType: BungieMembershipType,
    gameVersion: DestinyGameVersions,
    platformStatus: PlatformStatus
  ) => {
    const key = `${EnumUtils.getNumberValue(
      membershipType,
      BungieMembershipType
    )}${EnumUtils.getStringValue(gameVersion, DestinyGameVersions)}`;

    if (membershipType === BungieMembershipType.TigerXbox) {
      return msCell(gameVersion, platformStatus, key);
    }

    if (
      !ConfigUtils.SystemStatus(SystemNames.StadiaIdAuth) &&
      membershipType === BungieMembershipType.TigerStadia
    ) {
      return null;
    }

    const platformStatusClass = styles[platformStatus];

    return (
      <td className={platformStatusClass} key={key}>
        {stateOfEntitlement(membershipType, gameVersion)}
      </td>
    );
  };

  return (
    <div className={styles.entitlementsTableWrapper}>
      <p className={styles.entitlementsHeader}>
        {Localizer.Crosssave.EntitlementsHeader}
      </p>
      <p>{crosssaveLoc.YourEntitlementsDoNot}</p>
      <table className={styles.entitlementsTable}>
        <colgroup>
          <col />
          <col />
          <col />
          <col />
          <col />
        </colgroup>
        <EntitlementsTableHeader
          title={crosssaveLoc.Entitlements}
          flowState={props.flowState}
        />
        <tbody>
          <tr>
            <th scope="row">{crosssaveLoc.BeyondLightHeader}</th>
            {entitlementRow(DestinyGameVersions.BeyondLight)}
          </tr>
          <tr>
            <th scope="row">{crosssaveLoc.ShadowkeepHeader}</th>
            {entitlementRow(DestinyGameVersions.Shadowkeep)}
          </tr>
          <tr>
            <th scope="row">{crosssaveLoc.ForsakenHeader}</th>
            {entitlementRow(DestinyGameVersions.Forsaken)}
          </tr>
          <tr>
            <th scope="row">{crosssaveLoc.ThAnniversaryHeader}</th>
            {entitlementRow(DestinyGameVersions.Anniversary30th)}
          </tr>
          <tr>
            <th scope="row">{crosssaveLoc.TheWitchQueenHeader}</th>
            {entitlementRow(DestinyGameVersions.TheWitchQueen)}
          </tr>
          <tr>
            <th scope="row">{crosssaveLoc.LightfallHeader}</th>
            {entitlementRow(DestinyGameVersions.Lightfall)}
          </tr>
          <tr>
            <th scope="row">{crosssaveLoc.TheFinalShapeHeader}</th>
            {entitlementRow(DestinyGameVersions.TheFinalShape)}
          </tr>
          <tr>
            <th scope="row">{crosssaveLoc.EdgeOfFateHeader}</th>
            {entitlementRow(DestinyGameVersions.EdgeOfFate)}
          </tr>
          <tr>
            <th scope="row">{crosssaveLoc.RenegadesHeader}</th>
            {entitlementRow(DestinyGameVersions.Renegades)}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
