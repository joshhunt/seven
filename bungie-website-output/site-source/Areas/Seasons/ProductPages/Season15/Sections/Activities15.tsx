// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { SectionHeader } from "@Areas/Seasons/ProductPages/Season15/Components/SectionHeader";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStore";
import { Localizer } from "@bungie/localization";
import { IconActionCard } from "@UI/Marketing/IconActionCard";
import React, {
  LegacyRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./Activities15.module.scss";

interface Season15ActivitiesProps {
  inputRef: LegacyRef<HTMLDivElement>;
  toggleAstralModal: () => void;
  toggleShatteredRealmModal: () => void;
}

const Activities15: React.FC<Season15ActivitiesProps> = (props) => {
  const s15 = Localizer.Season15;

  return (
    <div className={styles.activities}>
      <div
        className={styles.sectionIdAnchor}
        id={"activities"}
        ref={props.inputRef}
      />
      <div className={styles.sectionBg} />
      <div className={styles.contentWrapperNormal}>
        <SectionHeader
          title={s15.ActivitiesHeading}
          seasonText={s15.SectionHeaderSeasonText}
          sectionName={s15.ActivitiesSectionName}
        />
        <div className={styles.btnFlexWrapper}>
          <IconActionCard
            cardTitle={s15.AstralAlignmentBtnHeading}
            cardSubtitle={s15.AstralAlignmentBtnSmallHeading}
            action={props.toggleAstralModal}
            classes={{ root: styles.blockBtn }}
            backgroundImage={
              "/7/ca/destiny/bgs/season15/s15_activities_modal_button_1.jpg"
            }
          />
          <IconActionCard
            cardTitle={s15.ShatteredRealmBtnHeading}
            cardSubtitle={s15.ShatteredRealmBtnSmallHeading}
            action={props.toggleShatteredRealmModal}
            classes={{ root: styles.blockBtn }}
            backgroundImage={
              "/7/ca/destiny/bgs/season15/s15_activities_modal_button_2.jpg"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Activities15;
