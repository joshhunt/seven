import { Layout } from "@Areas/FireteamFinder/Components/Layout/Layout";
import { Localizer } from "@bungie/localization/Localizer";
import { DestinyDefinitionType } from "@Database/DestinyDefinitions/DestinyDefinitions";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import React, { useEffect, useMemo, useState } from "react";
import { CoreBrowsing } from "@Areas/FireteamFinder/Components/CoreBrowse";
import styles from "./Index.module.scss";
import { useFireteamSearchParams } from "./Components/CoreBrowse/Helpers/Hooks";

interface IndexProps
  extends D2DatabaseComponentProps<
    "DestinyFireteamFinderActivityGraphDefinition"
  > {}
const Index: React.FC<IndexProps> = (props) => {
  const { params } = useFireteamSearchParams();
  const { activityGraphId } = params;
  //for search results
  const { title, subtitle } = useMemo(() => {
    let activityGraphDefinition = props.definitions?.DestinyFireteamFinderActivityGraphDefinition?.get(
      activityGraphId
    );
    let playerElectedDifficulty = "";
    if (activityGraphDefinition?.isPlayerElectedDifficultyNode) {
      playerElectedDifficulty =
        activityGraphDefinition?.displayProperties?.name;
      activityGraphDefinition = props.definitions.DestinyFireteamFinderActivityGraphDefinition?.get(
        activityGraphDefinition?.parentHash
      );
    }
    return {
      title: activityGraphDefinition?.displayProperties?.name,
      subtitle: playerElectedDifficulty,
    };
  }, [activityGraphId]);

  return (
    <Layout
      breadcrumbConfig={"browse"}
      buttonConfig={"browse"}
      title={title ?? Localizer.Fireteams.FireteamFinder}
      subtitle={subtitle}
      className={styles.background}
    >
      <CoreBrowsing />
    </Layout>
  );
};

export default withDestinyDefinitions(Index, {
  types: [
    "DestinyFireteamFinderActivityGraphDefinition" as DestinyDefinitionType,
  ],
});
