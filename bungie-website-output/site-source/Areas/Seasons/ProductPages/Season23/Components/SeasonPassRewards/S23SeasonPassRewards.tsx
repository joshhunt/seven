import SeasonPassRewardProgression from "@Areas/Seasons/Progress/SeasonPassRewardProgression";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { SystemNames } from "@Global/SystemNames";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { SeasonUtils } from "@Utilities/SeasonUtils";
import React from "react";
import styles from "./S22SeasonPassRewards.module.scss";

interface RewardsAndCalendar23Props
  extends D2DatabaseComponentProps<"DestinySeasonDefinition"> {}

const RewardsAndCalendar23: React.FC<RewardsAndCalendar23Props> = ({
  definitions,
}) => {
  if (!ConfigUtils.SystemStatus(SystemNames.Destiny2API)) {
    return null;
  }

  return (
    <div className={styles.root}>
      <SeasonPassRewardProgression
        seasonHash={SeasonUtils.GetSeasonHashFromSeasonNumber(
          23,
          definitions.DestinySeasonDefinition
        )}
      />
    </div>
  );
};

export default withDestinyDefinitions(RewardsAndCalendar23, {
  types: ["DestinySeasonDefinition"],
});
