// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { SectionHeader } from "@Areas/Seasons/ProductPages/Season16/Components/SectionHeader";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { IconActionCard } from "@UI/Marketing/IconActionCard";
import { responsiveBgImageFromStackFile } from "@Utilities/GraphQLUtils";
import React, {
  LegacyRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { BnetStackSeasonOfTheRisen } from "../../../../../Generated/contentstack-types";
import styles from "./Activities16.module.scss";

interface Season16ActivitiesProps {
  inputRef: LegacyRef<HTMLDivElement>;
  togglePsiopsModal: () => void;
  toggleSynapticModal: () => void;
  data: BnetStackSeasonOfTheRisen["activities_section_one"];
  headerSeasonText: string;
}

const Activities16: React.FC<Season16ActivitiesProps> = (props) => {
  const {
    inputRef,
    toggleSynapticModal,
    togglePsiopsModal,
    data,
    headerSeasonText,
  } = props;

  const { mobile } = useDataStore(Responsive);

  const sectionBg = responsiveBgImageFromStackFile(
    data?.bg.desktop,
    data?.bg.mobile,
    mobile
  );

  return (
    <div className={styles.activities}>
      <div
        className={styles.sectionIdAnchor}
        id={"activities"}
        ref={inputRef}
      />
      <div
        className={styles.sectionBg}
        style={{ backgroundImage: sectionBg }}
      />
      <div className={styles.contentWrapperNormal}>
        <SectionHeader
          title={data?.heading}
          seasonText={headerSeasonText}
          sectionName={data?.section_name}
        />
        <div className={styles.btnFlexWrapper}>
          <IconActionCard
            cardTitle={data?.btn_modal_group[0]?.title}
            cardSubtitle={data?.btn_modal_group[0]?.small_title}
            action={togglePsiopsModal}
            classes={{ root: styles.blockBtn }}
            backgroundImage={data?.btn_modal_group[0]?.btn.thumbnail?.url}
          />
          <IconActionCard
            cardTitle={data?.btn_modal_group[1]?.title}
            cardSubtitle={data?.btn_modal_group[1]?.small_title}
            action={toggleSynapticModal}
            classes={{ root: styles.blockBtn, background: styles.btnBg }}
            backgroundImage={data?.btn_modal_group[1]?.btn.thumbnail?.url}
          />
        </div>
      </div>
    </div>
  );
};

export default Activities16;
