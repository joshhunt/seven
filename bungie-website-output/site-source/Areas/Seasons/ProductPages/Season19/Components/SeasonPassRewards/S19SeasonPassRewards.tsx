import SeasonPassRewardProgression from "@Areas/Seasons/Progress/SeasonPassRewardProgression";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { SystemNames } from "@Global/SystemNames";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { SeasonUtils } from "@Utilities/SeasonUtils";
import React from "react";
import styles from "./S19SeasonPassRewards.module.scss";

interface RewardsAndCalendar16Props
  extends D2DatabaseComponentProps<"DestinySeasonDefinition"> {}

const RewardsAndCalendar18: React.FC<RewardsAndCalendar16Props> = ({
  definitions,
}) => {
  const destiny2Disabled = !ConfigUtils.SystemStatus(SystemNames.Destiny2);

  if (destiny2Disabled) {
    return null;
  }

  return (
    <div className={styles.root}>
      <SeasonPassRewardProgression
        seasonHash={SeasonUtils.GetSeasonHashFromSeasonNumber(
          19,
          definitions.DestinySeasonDefinition
        )}
      />
    </div>
  );
};

export default withDestinyDefinitions(RewardsAndCalendar18, {
  types: ["DestinySeasonDefinition"],
});
