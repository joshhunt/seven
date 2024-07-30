import SeasonPassRewardProgression from "@Areas/Seasons/Progress/SeasonPassRewardProgression";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { SystemNames } from "@Global/SystemNames";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { SeasonUtils } from "@Utilities/SeasonUtils";
import React from "react";
import styles from "./S21SeasonPassRewards.module.scss";

interface RewardsAndCalendar16Props
  extends D2DatabaseComponentProps<"DestinySeasonDefinition"> {}

const RewardsAndCalendar21: React.FC<RewardsAndCalendar16Props> = ({
  definitions,
}) => {
  if (!ConfigUtils.SystemStatus(SystemNames.Destiny2)) {
    return null;
  }

  return (
    <div className={styles.root}>
      <SeasonPassRewardProgression
        seasonHash={SeasonUtils.GetSeasonHashFromSeasonNumber(
          21,
          definitions.DestinySeasonDefinition
        )}
      />
    </div>
  );
};

export default withDestinyDefinitions(RewardsAndCalendar21, {
  types: ["DestinySeasonDefinition"],
});
