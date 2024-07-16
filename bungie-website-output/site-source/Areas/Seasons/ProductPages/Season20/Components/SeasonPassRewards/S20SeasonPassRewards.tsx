import SeasonPassRewardProgression from "@Areas/Seasons/Progress/SeasonPassRewardProgression";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { SystemNames } from "@Global/SystemNames";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { SeasonUtils } from "@Utilities/SeasonUtils";
import React from "react";
import styles from "./S20SeasonPassRewards.module.scss";

interface RewardsAndCalendar16Props
  extends D2DatabaseComponentProps<"DestinySeasonDefinition"> {}

const RewardsAndCalendar20: React.FC<RewardsAndCalendar16Props> = ({
  definitions,
}) => {
  if (!ConfigUtils.SystemStatus(SystemNames.Destiny2API)) {
    return null;
  }

  return (
    <div className={styles.root}>
      <SeasonPassRewardProgression
        seasonHash={SeasonUtils.GetSeasonHashFromSeasonNumber(
          20,
          definitions.DestinySeasonDefinition
        )}
      />
    </div>
  );
};

export default withDestinyDefinitions(RewardsAndCalendar20, {
  types: ["DestinySeasonDefinition"],
});
