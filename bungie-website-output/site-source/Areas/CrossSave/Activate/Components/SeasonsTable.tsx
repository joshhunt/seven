import styles from "@Areas/CrossSave/Activate/Components/EntitlementsTable.module.scss";
import { ICrossSaveFlowState } from "@Areas/CrossSave/Shared/CrossSaveFlowStateDataStore";
import { Localizer } from "@bungie/localization/Localizer";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { Seasons } from "@Platform";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import React, { useEffect, useState } from "react";

interface SeasonsTableProps
  extends D2DatabaseComponentProps<
    "DestinySeasonDefinition" | "DestinySeasonPassDefinition"
  > {
  flowState: ICrossSaveFlowState;
}

const SeasonsTable: React.FC<SeasonsTableProps> = (props) => {
  const crosssaveLoc = Localizer.Crosssave;
  const entitlementsResponse = props.flowState.entitlements;
  const linkedProfiles = props.flowState.linkedDestinyProfiles;
  const profileSeasonsItems = entitlementsResponse?.profileSeasons?.length;
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

  useEffect(() => {
    setAllSeasons(getAllSeasons(entitlementsResponse?.profileSeasons));
  }, [profileSeasonsItems]);

  if (
    !ConfigUtils.SystemStatus("CrossSaveEntitlementTables") ||
    allSeasons.length === 0 ||
    !entitlementsResponse ||
    !linkedProfiles
  ) {
    return null;
  }

  return (
    <div className={styles.entitlementsTableWrapper}>
      <p className={styles.entitlementsHeader}>
        {Localizer.Crosssave.SeasonsHeaderUpper}
      </p>
      <p>{crosssaveLoc.ActiveAccountSeasonsWill}</p>
    </div>
  );
};

export default withDestinyDefinitions(SeasonsTable, {
  types: ["DestinySeasonDefinition", "DestinySeasonPassDefinition"],
});
