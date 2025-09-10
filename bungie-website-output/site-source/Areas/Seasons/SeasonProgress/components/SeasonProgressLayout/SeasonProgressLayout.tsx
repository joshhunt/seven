import styles from "./SeasonProgressLayout.module.scss";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import React from "react";
import { BnetRewardsPassConfig } from "@Areas/Seasons/SeasonProgress/constants/BnetRewardsPassConfig";

export interface SeasonProgressLayoutProps {
  seasonDefinition: any;
  mode: "current" | "previous";
  passDefinition?: any;
}

export const SeasonProgressLayout: React.FC<SeasonProgressLayoutProps> = (
  props
) => {
  const { children, seasonDefinition, passDefinition, mode } = props;

  const rewardsPassStrings =
    mode === "current"
      ? BnetRewardsPassConfig.currentPass
      : BnetRewardsPassConfig.previousPass;

  const metaTitle = rewardsPassStrings?.title || "";

  const metaDesc =
    rewardsPassStrings?.title ||
    seasonDefinition?.displayProperties?.description ||
    rewardsPassStrings?.title ||
    "";

  const metaImage =
    passDefinition?.images?.iconImagePath ||
    rewardsPassStrings?.image ||
    passDefinition?.displayProperties?.icon ||
    seasonDefinition?.displayProperties?.icon ||
    seasonDefinition?.image ||
    "";

  // Prefer high-res pass art first, then localized fallback, then season
  const backgroundImage =
    rewardsPassStrings?.progressPageImage ||
    seasonDefinition?.displayProperties?.backgroundImagePath ||
    passDefinition?.images?.themeBackgroundImagePath ||
    seasonDefinition?.displayProperties?.backgroundImagePath ||
    "";

  return (
    <>
      <BungieHelmet title={metaTitle} description={metaDesc} image={metaImage}>
        <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
      </BungieHelmet>
      <div className={styles.wrapper}>
        <div
          className={styles.background}
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "top center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className={styles.seasonProgressDisplay}>{children}</div>
      </div>
    </>
  );
};

export default SeasonProgressLayout;
