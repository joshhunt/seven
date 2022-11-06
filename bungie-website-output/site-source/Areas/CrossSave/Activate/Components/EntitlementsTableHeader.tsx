// Created by atseng, 2022
// Copyright Bungie, Inc.

import { ICrossSaveFlowState } from "@Areas/CrossSave/Shared/CrossSaveFlowStateDataStore";
import { CrossSaveUtils } from "@Areas/CrossSave/Shared/CrossSaveUtils";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { BungieMembershipType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { EnumUtils } from "@Utilities/EnumUtils";
import React from "react";
import { SiEpicgames, SiStadia } from "react-icons/si";
import { FaPlaystation, FaSteam, FaXbox } from "react-icons/fa";
import { PlatformStatus } from "./EntitlementsTable";
import styles from "./EntitlementsTable.module.scss";

interface EntitlementsTableHeaderProps {
  flowState: ICrossSaveFlowState;
  title: string;
}

export const EntitlementsTableHeader: React.FC<EntitlementsTableHeaderProps> = (
  props
) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  const crosssaveLoc = Localizer.Crosssave;

  const entitlementsResponse = props.flowState.entitlements;
  const linkedProfiles = props.flowState.linkedDestinyProfiles;
  const pairableMembershipTypes = CrossSaveUtils.getPairableMembershipTypes(
    props.flowState
  );
  const primaryMembershipType = props.flowState.primaryMembershipType;
  const unlinked = CrossSaveUtils.getUnLinkedPairableMembershipTypes(
    props.flowState
  );

  const headerCell = (
    membershipType: BungieMembershipType,
    platformStatus: PlatformStatus
  ) => {
    const statusString =
      platformStatus === "active" ? crosssaveLoc[`${platformStatus}Label`] : "";
    const key = `header-${EnumUtils.getNumberValue(
      membershipType,
      BungieMembershipType
    )}`;

    switch (membershipType) {
      case BungieMembershipType.TigerStadia:
        return (
          <th className={styles[platformStatus]} key={key}>
            <SiStadia />
            {crosssaveLoc.StadiaHeader} {statusString}
          </th>
        );

      case BungieMembershipType.TigerXbox:
        return (
          <th className={styles[platformStatus]} key={key}>
            <FaXbox />
            {crosssaveLoc.MicrosoftHeader} {statusString}
          </th>
        );

      case BungieMembershipType.TigerPsn:
        return (
          <th className={styles[platformStatus]} key={key}>
            <FaPlaystation />
            {crosssaveLoc.PlaystationHeader} {statusString}
          </th>
        );

      case BungieMembershipType.TigerSteam:
        return (
          <th className={styles[platformStatus]} key={key}>
            <FaSteam />
            {crosssaveLoc.SteamHeader} {statusString}
          </th>
        );

      case BungieMembershipType.TigerEgs:
        return (
          <th className={styles[platformStatus]} key={key}>
            <SiEpicgames />
            {crosssaveLoc.EgsHeader} {statusString}
          </th>
        );

      default:
        return null;
    }
  };

  return (
    <thead>
      <tr>
        <th>{props.title}</th>
        {headerCell(primaryMembershipType, "active")}
        {pairableMembershipTypes
          .filter(
            (pm) => pm !== primaryMembershipType && !unlinked.includes(pm)
          )
          ?.map((lp) => headerCell(lp, "linked"))}
        {unlinked.map((un) => headerCell(un, "unlinked"))}
      </tr>
    </thead>
  );
};
