import { AccountSelect } from "@Areas/Seasons/SeasonProgress/components/SeasonHeaderLayout/AccountSelect";
import {
  SeasonsArray,
  SeasonsDefinitions,
} from "@Areas/Seasons/SeasonProgress/constants/SeasonsDefinitions";
import SeasonProgressUtils, {
  ISeasonUtilArgs,
} from "@Areas/Seasons/SeasonProgress/utils/SeasonProgressUtils";
import * as React from "react";
import styles from ".././SeasonHeaderLayout.module.scss";

interface SeasonTitleSectionProps {
  timeRemaining: string;
  seasonUtilArgs: ISeasonUtilArgs;
}

const SeasonTitleSection: React.FC<SeasonTitleSectionProps> = ({
  seasonUtilArgs,
  timeRemaining,
}) => {
  const seasonOnPage = SeasonsArray.find(
    (season) =>
      season?.seasonNumber ===
      SeasonProgressUtils?.getSeasonDefinition(seasonUtilArgs)?.seasonNumber
  );
  const isCurrent =
    SeasonsArray?.findIndex(
      (season) =>
        season?.seasonNumber === SeasonsDefinitions?.currentSeason?.seasonNumber
    ) !== -1;

  return (
    <div className={styles.seasonHeader}>
      <h1>{seasonOnPage?.title?.toUpperCase()}</h1>
      <h5>{timeRemaining}</h5>
      <AccountSelect isCurrentSeason={isCurrent} />
    </div>
  );
};

export default SeasonTitleSection;
