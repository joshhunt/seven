import { AccountSelect } from "@Areas/Seasons/SeasonProgress/components/SeasonHeaderLayout/AccountSelect";
import * as React from "react";
import styles from ".././SeasonHeaderLayout.module.scss";
import { BnetRewardsPassConfig } from "@Areas/Seasons/SeasonProgress/constants/BnetRewardsPassConfig";
import { Localizer } from "@bungie/localization/Localizer";

interface SeasonTitleSectionProps {
  timeRemaining: string;
  page: "current" | "previous";
}

const SeasonTitleSection: React.FC<SeasonTitleSectionProps> = ({
  timeRemaining,
  page,
}) => {
  const isCurrent = page === "current";
  const title = isCurrent
    ? BnetRewardsPassConfig.currentPass.title
    : BnetRewardsPassConfig.previousPass.title;
  const timeString = isCurrent
    ? timeRemaining
    : Localizer.seasons.rewardpassended;
  return (
    <div className={styles.seasonHeader}>
      <h1>{title.toUpperCase()}</h1>
      <h5>{timeString}</h5>
      <AccountSelect isCurrent={isCurrent} />
    </div>
  );
};

export default SeasonTitleSection;
