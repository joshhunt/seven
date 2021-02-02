// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@Global/DataStore";
import { MarketingTitles } from "@UI/Marketing/MarketingTitles";
import React, { LegacyRef, ReactElement } from "react";
import styles from "./Story13.module.scss";
import { Localizer } from "@Global/Localization/Localizer";

interface Story13Props {
  inputRef: LegacyRef<HTMLDivElement>;
}

export const Story13: React.FC<Story13Props> = (props) => {
  const s13 = Localizer.Season13;
  const responsive = useDataStore(Responsive);

  return (
    <div className={styles.bg} id={"storyOnly"} ref={props.inputRef}>
      <div className={styles.content}>
        <MarketingTitles
          alignment={responsive.mobile ? "left" : "center"}
          sectionTitle={s13.StoryTitle}
          smallTitle={s13.StorySmallTitle}
        />
        <div className={styles.blurb}>{s13.storyblurb}</div>
      </div>
    </div>
  );
};
